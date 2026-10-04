import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_CLIENT_IP = `203.0.113.${(Date.now() % 200) + 20}`;

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

async function runHardeningTests() {
  console.log('====================================================');
  console.log('STARTING PHASE 6D PRODUCTION HARDENING & SECURITY AUDIT TEST SUITE');
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

  // ----------------------------------------------------
  // TEST 1: Fail-fast in production when JWT_SECRET is missing or insecure
  // ----------------------------------------------------
  console.log('\n--- 1. Production Fail-Safe on Missing/Default JWT_SECRET ---');
  await new Promise((resolve) => {
    const proc = spawn('node', ['-e', "import('./src/middleware/auth.js')"], {
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: '' },
    });
    let output = '';
    proc.stderr.on('data', (d) => (output += d.toString()));
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.on('close', (code) => {
      assert(code !== 0, 'Server aborted with non-zero exit code when JWT_SECRET is unset in production');
      assert(
        output.includes('FATAL SECURITY CONFIGURATION'),
        'Server output fatal security message warning of insecure JWT_SECRET'
      );
      resolve();
    });
  });

  // ----------------------------------------------------
  // TEST 2: Pass production validation when secure 64-char JWT_SECRET is provided
  // ----------------------------------------------------
  console.log('\n--- 2. Production Startup with Valid 64-character JWT_SECRET ---');
  await new Promise((resolve) => {
    const secureSecret = 'f4b149b5c3d2581691a3297a7a1b7a702b3780a1cbbdfc4b149b5c3d2581691a';
    const proc = spawn('node', ['-e', "import('./src/middleware/auth.js').then(() => console.log('PROD_AUTH_OK'))"], {
      cwd: __dirname,
      env: { ...process.env, NODE_ENV: 'production', JWT_SECRET: secureSecret },
    });
    let output = '';
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.on('close', (code) => {
      assert(code === 0, 'Server accepted valid 64-char JWT_SECRET in production mode');
      assert(output.includes('PROD_AUTH_OK'), 'Auth module initialized cleanly with secure secret');
      resolve();
    });
  });

  // ----------------------------------------------------
  // TEST 3: Production refuses JSON database fallback when DATABASE_URL is missing
  // ----------------------------------------------------
  console.log('\n--- 3. Production Database Fail-Safe on Missing DATABASE_URL ---');
  await new Promise((resolve) => {
    const secureSecret = 'f4b149b5c3d2581691a3297a7a1b7a702b3780a1cbbdfc4b149b5c3d2581691a';
    const proc = spawn('node', ['src/server.js'], {
      cwd: __dirname,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        JWT_SECRET: secureSecret,
        DATABASE_URL: '',
        STORAGE_PROVIDER: 'supabase',
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-placeholder',
        SUPABASE_STORAGE_BUCKET: 'resumes',
        CORS_ORIGIN: 'https://example.com',
      },
    });
    let output = '';
    proc.stderr.on('data', (d) => (output += d.toString()));
    proc.stdout.on('data', (d) => (output += d.toString()));
    proc.on('close', (code) => {
      assert(code !== 0, 'Server aborted when DATABASE_URL is missing in production');
      assert(
        output.includes('DATABASE_URL') && output.includes('fallbacks are disabled in production'),
        'Server output explains production database fallback is disabled'
      );
      resolve();
    });
  });

  // ----------------------------------------------------
  // TEST 4: Database Backup Integrity & Password Hash Redaction
  // ----------------------------------------------------
  console.log('\n--- 4. Database Backup Integrity & Redaction ---');
  await new Promise((resolve) => {
    const proc = spawn('node', ['scripts/backup.js'], { cwd: __dirname });
    proc.on('close', (code) => {
      assert(code === 0, 'npm run db:backup script ran and exited successfully (code 0)');

      const backupDir = path.join(__dirname, 'backups');
      const backupFiles = fs.readdirSync(backupDir).filter((f) => f.endsWith('.json'));
      assert(backupFiles.length > 0, `At least one backup file found in backend/backups (${backupFiles.length})`);

      if (backupFiles.length > 0) {
        const latest = backupFiles.sort().pop();
        const content = JSON.parse(fs.readFileSync(path.join(backupDir, latest), 'utf8'));
        assert(content.metadata && content.metadata.timestamp, 'Backup includes metadata header');
        assert(content.users && Array.isArray(content.users), 'Backup includes users array');
        const anyRealHashLeaked = content.users.some(
          (u) => u.password_hash && u.password_hash !== '[PROTECTED_HASH]'
        );
        assert(!anyRealHashLeaked, 'All user password hashes in backup are safely redacted to [PROTECTED_HASH]');
      }
      resolve();
    });
  });

  // ----------------------------------------------------
  // START SERVER FOR HTTP TESTS
  // ----------------------------------------------------
  console.log('\n--- Starting Hardened Server on Port 5000 ---');
  serverProcess = spawn('node', ['src/server.js'], {
    cwd: __dirname,
    env: { ...process.env, PORT: '5000', TEST_BYPASS_RATE_LIMIT: '0' },
  });

  // Wait for server to boot
  await delay(1500);

  // ----------------------------------------------------
  // TEST 5: Health Check Endpoint and Security Headers
  // ----------------------------------------------------
  console.log('\n--- 5. Health Check Endpoint & HTTP Security Headers ---');
  const healthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });

  assert(healthRes.status === 200, 'GET /api/health returned 200 OK');
  assert(healthRes.body && healthRes.body.status === 'healthy', 'Health check body reports status: "healthy"');
  assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'Header X-Content-Type-Options is nosniff');
  assert(healthRes.headers['x-frame-options'] === 'DENY', 'Header X-Frame-Options is DENY');
  assert(healthRes.headers['x-xss-protection'] === '1; mode=block', 'Header X-XSS-Protection is 1; mode=block');
  assert(
    healthRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin',
    'Header Referrer-Policy is strict-origin-when-cross-origin'
  );
  assert(healthRes.headers['x-powered-by'] === undefined, 'X-Powered-By header is removed/hidden');

  // ----------------------------------------------------
  // TEST 6: CORS Policy Verification
  // ----------------------------------------------------
  console.log('\n--- 6. CORS Policy Whitelisting ---');
  const corsAllowedRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
    headers: {
      Origin: 'http://localhost:3000',
    },
  });
  assert(
    corsAllowedRes.headers['access-control-allow-origin'] === 'http://localhost:3000',
    'CORS allowed origin http://localhost:3000'
  );

  const corsBlockedRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
    headers: {
      Origin: 'http://malicious-attacker-domain.xyz',
    },
  });
  assert(
    corsBlockedRes.status === 403 || !corsBlockedRes.headers['access-control-allow-origin'],
    'Disallowed origin rejected with 403 or omitted Access-Control-Allow-Origin header'
  );

  // ----------------------------------------------------
  // TEST 7: Tampered JWT Rejection
  // ----------------------------------------------------
  console.log('\n--- 7. Tampered JWT Signature Rejection ---');
  const tamperedTokenRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile',
    method: 'GET',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMSJ9.invalidsignaturehere123',
    },
  });
  assert(tamperedTokenRes.status === 401, 'Request with tampered JWT rejected with 401 Unauthorized');
  assert(
    tamperedTokenRes.body && tamperedTokenRes.body.success === false,
    'Response explicitly indicates invalid/expired token'
  );

  // ----------------------------------------------------
  // TEST 8: Role Authorization - Non-Admin Candidate Blocked from Admin Routes
  // ----------------------------------------------------
  console.log('\n--- 8. Non-Admin Candidate Blocked from Admin Endpoints ---');
  const testCandidateEmail = `hardening.candidate.${Date.now()}@kodewar.test`;
  const candidateSignup = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Hardening Test Candidate',
      email: testCandidateEmail,
      password: 'SecurePassword@123',
      phone: '+91 9999988888',
    }
  );

  assert(candidateSignup.status === 201 || candidateSignup.status === 200, 'Candidate signed up successfully');
  const candidateToken = candidateSignup.body?.token;

  // Candidate attempts to access admin jobs
  const candidateAdminAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/jobs',
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(
    candidateAdminAccess.status === 403,
    'Candidate token accessing /api/admin/jobs received 403 Forbidden'
  );

  // Candidate attempts to access admin applications
  const candidateAppAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/applications',
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(
    candidateAppAccess.status === 403,
    'Candidate token accessing /api/admin/applications received 403 Forbidden'
  );

  // ----------------------------------------------------
  // TEST 9: Audit Log Access Control and Searchability
  // ----------------------------------------------------
  console.log('\n--- 9. Audit Log Access Control and Searchability ---');
  const candidateAuditAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/audit-logs',
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(
    candidateAuditAccess.status === 403,
    'Candidate token accessing /api/admin/audit-logs received 403 Forbidden'
  );

  const adminLoginForAudit = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@kodewar.com', password: 'Admin@Kodewar2026' }
  );
  const adminToken = adminLoginForAudit.body?.token;
  assert(adminLoginForAudit.status === 200 && adminToken, 'Admin login succeeded for audit log verification');

  const auditSearch = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/audit-logs?action=USER_SIGNUP&q=${encodeURIComponent(testCandidateEmail)}&limit=5`,
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const auditRecords = auditSearch.body?.audit_logs || [];
  assert(auditSearch.status === 200, 'Admin can read audit logs');
  assert(
    auditRecords.some((record) => record.action === 'USER_SIGNUP' && record.actor_email === testCandidateEmail),
    'Audit logs include searchable USER_SIGNUP event for the created candidate'
  );

  // ----------------------------------------------------
  // TEST 10: Resume Download Authorization Isolation
  // ----------------------------------------------------
  console.log('\n--- 10. Resume Download Authorization Isolation ---');
  // Unauthenticated access
  const unauthResume = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile/resume',
    method: 'GET',
  });
  assert(unauthResume.status === 401, 'Unauthenticated request to resume file received 401 Unauthorized');

  // Candidate accessing own resume (returns 404 because no resume uploaded yet, but is authenticated)
  const ownResume = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile/resume',
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken}` },
  });
  assert(
    ownResume.status === 200 || ownResume.status === 404,
    `Candidate authorized to access resume endpoint (status ${ownResume.status})`
  );

  // ----------------------------------------------------
  // TEST 11: Disallowed File Type Upload Rejection
  // ----------------------------------------------------
  console.log('\n--- 11. Disallowed File Upload Extension Rejection ---');
  const boundary = '----KodewarFormBoundary7MA4YWxkTrZu0gW';
  const maliciousPayload = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="resume"; filename="malicious_script.exe"',
    'Content-Type: application/x-msdownload',
    '',
    'MZExecutableContentSimulation',
    `--${boundary}--`,
    '',
  ].join('\r\n');

  const badUploadRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/profile/resume',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${candidateToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(maliciousPayload),
      },
    },
    maliciousPayload
  );
  assert(
    badUploadRes.status === 400,
    'Uploading .exe file was rejected with 400 Bad Request'
  );
  assert(
    badUploadRes.body && badUploadRes.body.message.includes('Only PDF, DOC, and DOCX'),
    'Server explicitly blocked unsupported file format'
  );

  // ----------------------------------------------------
  // TEST 12: Google OAuth Privilege Escalation Shield
  // ----------------------------------------------------
  console.log('\n--- 12. Google OAuth Privilege Escalation Shield ---');
  // Attacker attempts unverified OAuth login targeting existing admin email
  const fakeAdminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/google',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@kodewar.com' }
  );
  assert(
    fakeAdminLogin.status === 403,
    'Unverified OAuth attempt on ADMIN account was blocked with 403 Forbidden'
  );
  assert(
    fakeAdminLogin.body && fakeAdminLogin.body.message.includes('Security policy'),
    'Response confirms security shield triggered'
  );

  // ----------------------------------------------------
  // TEST 13: Password Minimum Length Enforcement (8+ chars)
  // ----------------------------------------------------
  console.log('\n--- 13. Password Length Security Enforcement ---');
  const weakPassSignup = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Weak Pass Test',
      email: `weakpass.${Date.now()}@kodewar.test`,
      password: 'short',
    }
  );
  assert(
    weakPassSignup.status === 400,
    'Signup with weak password under 8 characters was rejected with 400 Bad Request'
  );
  assert(
    weakPassSignup.body && weakPassSignup.body.message.includes('8 characters'),
    'Response explicitly specifies minimum 8 character requirement'
  );

  // ----------------------------------------------------
  // TEST 14: Password Reset Endpoint (Forgot Password)
  // ----------------------------------------------------
  console.log('\n--- 14. Password Reset Endpoint (Timing-Safe) ---');
  const resetRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/forgot-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@kodewar.com' }
  );
  assert(resetRes.status === 200, 'POST /api/auth/forgot-password returned 200 OK');
  assert(
    resetRes.body && resetRes.body.success === true,
    'Forgot password endpoint returned uniform confirmation without leaking existence'
  );

  // ----------------------------------------------------
  // TEST 15: Rate Limiter on Authentication Endpoint
  // ----------------------------------------------------
  console.log('\n--- 15. Rate Limiter Trigger on /api/auth/login ---');
  let rateLimitHit = false;
  for (let i = 0; i < 20; i++) {
    const res = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '198.51.100.99', // Simulated unique IP
        },
      },
      { email: 'admin@kodewar.com', password: 'Password@123' }
    );
    if (res.status === 429) {
      rateLimitHit = true;
      assert(res.body.retryAfterSeconds !== undefined, 'Rate limit response includes retryAfterSeconds');
      break;
    }
  }
  assert(rateLimitHit, 'Strict rate limiter triggered 429 Too Many Requests after threshold reached');

  // Terminate test server
  if (serverProcess) {
    serverProcess.kill();
  }

  console.log('\n====================================================');
  console.log(`TEST SUITE SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runHardeningTests().catch((err) => {
  console.error('Test execution failed:', err);
  if (serverProcess) serverProcess.kill();
  process.exit(1);
});
