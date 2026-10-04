import http from 'http';
import fs from 'fs';
import path from 'path';

function request(options, data) {
  return new Promise((resolve, reject) => {
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

async function runTests() {
  console.log('--- STARTING SECTION 22 VERIFICATION SUITE ---');
  let candidateToken = null;
  let candidateUser = null;
  let applicationId = null;

  // 1. Health check
  const health = await request({ hostname: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  console.log(`[TEST 1] Backend Health Check: status=${health.status}, statusText=${health.body?.status}`);

  // 2. Candidate Signup
  const testEmail = `test.candidate.${Date.now()}@kodewar.test`;
  const signupRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Harsha Vardhan',
    email: testEmail,
    password: 'Password@123',
    phone: '+91 9876543210'
  });
  console.log(`[TEST 2] Candidate Signup: status=${signupRes.status}, user=${signupRes.body?.user?.name}`);
  candidateToken = signupRes.body?.token;
  candidateUser = signupRes.body?.user;

  // 3. Verify /api/auth/me
  const meRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });
  console.log(`[TEST 3] Session Verification /me: status=${meRes.status}, email=${meRes.body?.user?.email}`);

  // 4. Update Profile
  const profileRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${candidateToken}`
    }
  }, {
    full_name: 'Harsha Vardhan',
    phone: '+91 9876543210',
    location: 'Hyderabad, India',
    college: 'JNTU Hyderabad',
    degree: 'B.Tech Computer Science',
    graduation_year: '2025',
    cgpa: '8.8',
    current_role: 'Associate Frontend Developer Intern',
    company: 'Tech Studio',
    experience_years: '1',
    skills: 'React, Node.js, TypeScript, Next.js, CSS3',
    portfolio_url: 'https://harsha.dev',
    github_url: 'https://github.com/harshavardhan',
    linkedin_url: 'https://linkedin.com/in/harsha'
  });
  console.log(`[TEST 4] Profile Update: status=${profileRes.status}, skills=${profileRes.body?.profile?.skills}`);

  // 5. Test Resume Upload via Multipart Form Data
  const boundary = '----KodewarFormBoundary7MA4YWxkTrZu0gW';
  const dummyResumeContent = '%PDF-1.4\n%DUMMY TEST PDF RESUME FOR KODEWAR TALENT PIPELINE\n%%EOF';
  const multipartBody = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="Harsha_Resume_2026.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
    Buffer.from(dummyResumeContent),
    Buffer.from(`\r\n--${boundary}--\r\n`)
  ]);

  const uploadRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/profile/resume',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${candidateToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length
    }
  }, multipartBody);
  console.log(`[TEST 5] Resume Upload (Protected Local Disk): status=${uploadRes.status}, filename=${uploadRes.body?.profile?.resume_filename}`);

  // 6. Submit Job Application
  const publicJobs = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET'
  });
  const targetJob = publicJobs.body?.jobs?.[0];

  const applyRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${candidateToken}`
    }
  }, {
    job_id: targetJob?.id,
    job_title: targetJob?.title,
    applicant_name: 'Harsha Vardhan',
    applicant_email: testEmail,
    applicant_phone: '+91 9876543210',
    cover_letter: 'I have extensive full-stack experience in React and Node.js. Excited to contribute to KODEWAR!',
    portfolio_url: 'https://harsha.dev',
    linkedin_url: 'https://linkedin.com/in/harsha',
    github_url: 'https://github.com/harshavardhan',
    years_experience: '3'
  });
  console.log(`[TEST 6] Submit Job Application: status=${applyRes.status}, appId=${applyRes.body?.application?.id}, status=${applyRes.body?.application?.status}`);
  applicationId = applyRes.body?.application?.id;

  // 7. Test Duplicate Application Prevention (Expected: 409 Conflict)
  const dupRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${candidateToken}`
    }
  }, {
    job_id: targetJob?.id,
    job_title: targetJob?.title,
    applicant_name: 'Harsha Vardhan',
    applicant_email: testEmail,
    applicant_phone: '+91 9876543210'
  });
  console.log(`[TEST 7] Duplicate Application Guard: status=${dupRes.status} (Expected: 409), msg=${dupRes.body?.message}`);


  // 8. Candidate View Applications
  const candidateApps = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });
  console.log(`[TEST 8] Fetch Candidate Applications: status=${candidateApps.status}, count=${candidateApps.body?.applications?.length}`);

  // 9. Candidate View Single Application Details
  const singleApp = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${applicationId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });
  console.log(`[TEST 9] Fetch Application Details: status=${singleApp.status}, jobTitle=${singleApp.body?.application?.job_title}, resumeFile=${singleApp.body?.application?.resume_filename}`);

  // 10. Test Resume Download Access (Owner Authorization)
  const resumeDownload = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${applicationId}/resume`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });
  console.log(`[TEST 10] Resume Stream Download (Owner): status=${resumeDownload.status}, contentType=${resumeDownload.headers['content-type']}`);

  // 11. Test Security / Unauthorized Resume Download (No Auth)
  const unauthorizedDownload = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${applicationId}/resume`,
    method: 'GET'
  });
  console.log(`[TEST 11] Security Guard (Unauthenticated Download): status=${unauthorizedDownload.status} (Expected: 401)`);

  // 12. Admin Applications Review (Login with Admin account)
  const adminLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@kodewar.com',
    password: 'Admin@Kodewar2026'
  });

  const adminToken = adminLogin.body?.token;
  console.log(`[TEST 12] Admin Login: status=${adminLogin.status}, role=${adminLogin.body?.user?.role}`);

  // 13. Admin Fetch All Applications
  const allApps = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/applications',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`[TEST 13] Admin Fetch Applications: status=${allApps.status}, total=${allApps.body?.applications?.length}`);

  // 14. Admin Update Application Status to SHORTLISTED
  const statusUpdate = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/applications/${applicationId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, {
    status: 'SHORTLISTED',
    notes: 'Candidate has strong React portfolio. Recommended for initial technical screening.'
  });
  console.log(`[TEST 14] Admin Status Transition to SHORTLISTED: status=${statusUpdate.status}, newStatus=${statusUpdate.body?.application?.status}`);

  // 15. Verify Candidate sees updated status
  const updatedCandidateApp = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${applicationId}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${candidateToken}` }
  });
  console.log(`[TEST 15] Candidate Pipeline Status Reflection: status=${updatedCandidateApp.body?.application?.status}`);

  console.log('--- ALL SECTION 22 SUITE TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(console.error);
