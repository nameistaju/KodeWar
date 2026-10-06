import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_CLIENT_IP = `203.0.113.${(Date.now() % 200) + 35}`;

function request(options, data) {
  return new Promise((resolve, reject) => {
    options.headers = {
      'X-Forwarded-For': TEST_CLIENT_IP,
      ...(options.headers || {}),
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      if (typeof data === 'string' || Buffer.isBuffer(data)) {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let serverProcess = null;

async function runPromotionSyncTests() {
  console.log('====================================================');
  console.log('STARTING PHASE 6G PROMOTIONS SYNC & CLOUDINARY TEST');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Start server or check if port 5000 is running
  const testPort = 5002;
  console.log(`Spawning backend test instance on port ${testPort}...`);
  serverProcess = spawn('node', ['src/server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: String(testPort) },
    stdio: 'pipe',
  });

  serverProcess.stdout.on('data', (d) => {
    // console.log(`[Server] ${d.toString().trim()}`);
  });
  serverProcess.stderr.on('data', (d) => {
    // console.error(`[Server Err] ${d.toString().trim()}`);
  });

  await delay(2500);

  const baseOpt = {
    hostname: '127.0.0.1',
    port: testPort,
  };

  try {
    // TEST 1: Public GET /api/promotions anti-caching headers
    console.log('\n--- Test 1: Anti-caching headers on /api/promotions ---');
    const pubRes = await request({
      ...baseOpt,
      path: '/api/promotions',
      method: 'GET',
    });
    assert(pubRes.status === 200, `Public GET /api/promotions returns 200 (Got ${pubRes.status})`);
    const cacheCtrl = pubRes.headers['cache-control'] || '';
    assert(
      cacheCtrl.includes('no-store') || cacheCtrl.includes('no-cache'),
      `Cache-Control header prevents stale caching: "${cacheCtrl}"`
    );
    assert(Array.isArray(pubRes.body?.promotions), 'Returns promotions array');

    // TEST 2: Authorization enforcement on Admin Promotion Endpoints
    console.log('\n--- Test 2: Admin routes require admin authorization ---');
    const unauthPost = await request({
      ...baseOpt,
      path: '/api/admin/promotions',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, { title: 'Unauthorized' });
    assert(unauthPost.status === 401 || unauthPost.status === 403, `Unauthenticated POST rejected with ${unauthPost.status}`);

    const unauthPut = await request({
      ...baseOpt,
      path: '/api/admin/promotions/test-id',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }, { title: 'Unauthorized' });
    assert(unauthPut.status === 401 || unauthPut.status === 403, `Unauthenticated PUT rejected with ${unauthPut.status}`);

    const unauthDel = await request({
      ...baseOpt,
      path: '/api/admin/promotions/test-id',
      method: 'DELETE',
    });
    assert(unauthDel.status === 401 || unauthDel.status === 403, `Unauthenticated DELETE rejected with ${unauthDel.status}`);

    // TEST 3: Admin login
    console.log('\n--- Test 3: Admin authentication ---');
    const loginRes = await request({
      ...baseOpt,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, {
      email: 'admin@kodewar.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@Kodewar2026',
    });

    let adminToken = loginRes.body?.token;
    if (!adminToken) {
      console.warn('Default admin login failed:', loginRes.body);
    }
    assert(Boolean(adminToken), 'Admin login successful and JWT token received');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    };

    // TEST 4: Create Promotion with URL artwork
    console.log('\n--- Test 4: Create promotion with server-derived metadata ---');
    const newPromoPayload = {
      title: 'Automated Test Campaign ' + Date.now(),
      image: 'https://res.cloudinary.com/dazbkmdcq/image/upload/v1791216612/kodewar/promotions/dussehra-special-2026.jpg',
      destinationUrl: '/test-campaign',
      homepageBanner: true,
      popup: true,
      enabled: true,
      priority: 5,
      popupDelay: 3,
      popupFrequency: 'session',
      autoClose: true,
      autoCloseDuration: 8,
      openInNewTab: true,
    };

    const createRes = await request({
      ...baseOpt,
      path: '/api/admin/promotions',
      method: 'POST',
      headers: authHeaders,
    }, newPromoPayload);

    assert(createRes.status === 201, `POST /api/admin/promotions returned 201 (Got ${createRes.status})`);
    assert(createRes.body?.success === true, 'Response indicates success');
    const createdPromo = createRes.body?.promotion;
    assert(Boolean(createdPromo?.id), `Promotion created with ID: ${createdPromo?.id}`);
    assert(createdPromo?.title === newPromoPayload.title, 'Title matches');
    assert(createdPromo?.homepageBanner === true && createdPromo?.popup === true, 'Surface placement correctly derived');

    // TEST 5: Verify public API returns newly created promotion immediately
    console.log('\n--- Test 5: Verify cross-browser public sync ---');
    const syncRes = await request({
      ...baseOpt,
      path: `/api/promotions?_t=${Date.now()}`,
      method: 'GET',
    });
    assert(syncRes.status === 200, 'GET /api/promotions succeeds');
    const foundInPublic = syncRes.body?.promotions?.find((p) => p.id === createdPromo?.id);
    assert(Boolean(foundInPublic), 'Newly created promotion is returned in public API for all clients');

    // TEST 6: Update Promotion
    console.log('\n--- Test 6: Update promotion metadata ---');
    const updatedTitle = 'Updated Test Campaign ' + Date.now();
    const updateRes = await request({
      ...baseOpt,
      path: `/api/admin/promotions/${createdPromo.id}`,
      method: 'PUT',
      headers: authHeaders,
    }, {
      title: updatedTitle,
      priority: 10,
    });
    assert(updateRes.status === 200, `PUT /api/admin/promotions/:id returned 200 (Got ${updateRes.status})`);
    assert(updateRes.body?.promotion?.title === updatedTitle, 'Updated title confirmed in response');
    assert(updateRes.body?.promotion?.priority === 10, 'Updated priority confirmed in response');

    // TEST 7: Delete Promotion
    console.log('\n--- Test 7: Delete promotion ---');
    const deleteRes = await request({
      ...baseOpt,
      path: `/api/admin/promotions/${createdPromo.id}`,
      method: 'DELETE',
      headers: authHeaders,
    });
    assert(deleteRes.status === 200, `DELETE /api/admin/promotions/:id returned 200 (Got ${deleteRes.status})`);
    assert(deleteRes.body?.success === true, 'Delete response indicates success');

    // TEST 8: Verify promotion is removed from public API
    console.log('\n--- Test 8: Verify deletion reflects in public API ---');
    const postDeleteSync = await request({
      ...baseOpt,
      path: `/api/promotions?_t=${Date.now()}`,
      method: 'GET',
    });
    const stillPresent = postDeleteSync.body?.promotions?.find((p) => p.id === createdPromo?.id);
    assert(!stillPresent, 'Deleted promotion is no longer present in public API');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');
  process.exit(failed > 0 ? 1 : 0);
}

runPromotionSyncTests();
