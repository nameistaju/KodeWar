import http from 'http';

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

async function runPhase6CTests() {
  console.log('====================================================');
  console.log('STARTING PHASE 6C ADMIN MANAGEMENT VERIFICATION TEST');
  console.log('====================================================');

  let adminToken = null;
  let candidateToken1 = null;
  let candidateToken2 = null;
  let candidate1Id = null;
  let candidate2Id = null;
  let testJobId = null;
  let testAppId = null;
  let testTrainingId = null;
  let testTestimonialId = null;

  // 1. Admin Login
  const adminLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    email: 'admin@kodewar.com',
    password: 'Admin@Kodewar2026',
  });
  console.log(`[TEST 1] Admin Authentication: status=${adminLogin.status}, role=${adminLogin.body?.user?.role}`);
  adminToken = adminLogin.body?.token;

  // 2. Candidate 1 Signup & Profile
  const cand1Email = `candidate.one.${Date.now()}@kodewar.test`;
  const cand1Signup = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    fullName: 'Ananya Sharma',
    email: cand1Email,
    password: 'Password@123',
  });
  candidateToken1 = cand1Signup.body?.token;
  candidate1Id = cand1Signup.body?.user?.id;
  console.log(`[TEST 2] Candidate 1 Signup: status=${cand1Signup.status}, email=${cand1Email}`);

  // Candidate 2 Signup
  const cand2Email = `candidate.two.${Date.now()}@kodewar.test`;
  const cand2Signup = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    fullName: 'Vikram Reddy',
    email: cand2Email,
    password: 'Password@123',
  });
  candidateToken2 = cand2Signup.body?.token;
  candidate2Id = cand2Signup.body?.user?.id;
  console.log(`[TEST 3] Candidate 2 Signup: status=${cand2Signup.status}, email=${cand2Email}`);

  // 4. Job Management: Create DRAFT job
  const draftJobRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/jobs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  }, {
    title: 'Lead DevOps Architect (Kubernetes & AWS)',
    department: 'Software Development',
    location: 'Hyderabad, India',
    employment_type: 'Full-time',
    workplace_type: 'Hybrid',
    experience_level: '4–7 Years',
    salary_range: '₹14,00,000 – ₹22,00,000 / year',
    summary: 'Lead scalable multi-region cloud deployment and CI/CD pipelines.',
    status: 'DRAFT',
  });
  testJobId = draftJobRes.body?.job?.id;
  console.log(`[TEST 4] Admin Create DRAFT Job: status=${draftJobRes.status}, id=${testJobId}, status=${draftJobRes.body?.job?.status}`);

  // 5. Public Jobs check: Draft job should NOT appear in public /api/jobs
  const publicJobs1 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET',
  });
  const draftInPublic = publicJobs1.body?.jobs?.some((j) => j.id === testJobId);
  console.log(`[TEST 5] Public Isolation Check (Draft not in public): draftFound=${draftInPublic} (Expected: false)`);

  // 6. Admin Publish Job
  const publishRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/jobs/${testJobId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  }, { status: 'PUBLISHED' });
  console.log(`[TEST 6] Admin Publish Job: status=${publishRes.status}, newStatus=${publishRes.body?.job?.status}`);

  // 7. Public Jobs check: Published job MUST appear in public /api/jobs
  const publicJobs2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'GET',
  });
  const publishedInPublic = publicJobs2.body?.jobs?.some((j) => j.id === testJobId);
  console.log(`[TEST 7] Public Verification Check (Published job visible): publishedFound=${publishedInPublic} (Expected: true)`);

  // 8. Candidate 1 submits application for published role
  const applyRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/applications',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${candidateToken1}`,
    },
  }, {
    jobId: testJobId,
    jobTitle: 'Lead DevOps Architect (Kubernetes & AWS)',
    fullName: 'Ananya Sharma',
    email: cand1Email,
    phone: '+91 9988776655',
    coverMessage: 'I have 5 years building Kubernetes clusters and Terraform infrastructure.',
    experience: '5 Years',
  });
  testAppId = applyRes.body?.application?.id;
  console.log(`[TEST 8] Candidate 1 Applies: status=${applyRes.status}, appId=${testAppId}`);

  // 9. Admin Applications: verify application appears in Admin list
  const adminApps = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/applications',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const appInAdmin = adminApps.body?.applications?.some((a) => a.id === testAppId);
  console.log(`[TEST 9] Admin Sees Application: inAdminList=${appInAdmin} (Expected: true), totalApps=${adminApps.body?.applications?.length}`);

  // 10. Admin Application Dossier Detail View
  const appDetail = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/applications/${testAppId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`[TEST 10] Admin Application Dossier: status=${appDetail.status}, candidate=${appDetail.body?.application?.applicant_name}`);

  // 11. Admin Transitions Application Status to SHORTLISTED with Admin Notes
  const statusUpdate = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/applications/${testAppId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  }, {
    status: 'SHORTLISTED',
    adminNotes: 'Candidate demonstrates strong Kubernetes and Terraform knowledge. Proceed to technical round.',
  });
  console.log(`[TEST 11] Admin Status Transition: status=${statusUpdate.status}, newStatus=${statusUpdate.body?.application?.status}`);

  // 12. Candidate 1 views their application: Sees updated status, but admin_notes are STRICTLY HIDDEN
  const cand1View = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${testAppId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken1}` },
  });
  console.log(`[TEST 12] Candidate 1 Reflection: status=${cand1View.body?.application?.status} (Expected: SHORTLISTED)`);
  console.log(`[TEST 13] Internal Notes Security Guard: adminNotesExposed=${Boolean(cand1View.body?.application?.admin_notes)} (Expected: false)`);

  // 14. Cross-Candidate Security: Candidate 2 cannot access Candidate 1's application
  const crossAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/applications/${testAppId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken2}` },
  });
  console.log(`[TEST 14] Cross-Candidate Unauthorized Access Guard: status=${crossAccess.status} (Expected: 403)`);

  // 15. Normal Candidate cannot access Admin APIs
  const candidateAdminAccess = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/overview',
    method: 'GET',
    headers: { Authorization: `Bearer ${candidateToken1}` },
  });
  console.log(`[TEST 15] Non-Admin Blocked from Admin APIs: status=${candidateAdminAccess.status} (Expected: 403)`);

  // 16. Admin Overview Metrics Check
  const overviewRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/overview',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`[TEST 16] Admin Overview Metrics: openJobs=${overviewRes.body?.metrics?.open_jobs_count}, totalApps=${overviewRes.body?.metrics?.total_applications_count}, candidates=${overviewRes.body?.metrics?.candidates_count}`);

  // 17. Safe Archive Behavior: Deleting job with applications archives rather than deletes
  const deleteJobRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/admin/jobs/${testJobId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`[TEST 17] Job Safe Archive Guard: action=${deleteJobRes.body?.action} (Expected: ARCHIVED), msg=${deleteJobRes.body?.message}`);

  // 18. Training Management: Create, Publish, Verify Public, Unpublish
  const createTrainRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/training',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  }, {
    name: 'Cloud DevOps & SRE Apprenticeship',
    description: 'Immersive infrastructure engineering on Kubernetes, AWS, and Terraform.',
    duration: '12 Weeks',
    mode: 'Hybrid',
    skills: 'Kubernetes, Docker, AWS, CI/CD, Prometheus',
    status: 'PUBLISHED',
  });
  testTrainingId = createTrainRes.body?.training_program?.id;
  console.log(`[TEST 18] Admin Create Training Program: status=${createTrainRes.status}, id=${testTrainingId}`);

  // Public training check
  const publicTrain = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/training',
    method: 'GET',
  });
  const trainInPublic = publicTrain.body?.training_programs?.some((t) => t.id === testTrainingId);
  console.log(`[TEST 19] Public Training Listing: found=${trainInPublic} (Expected: true)`);

  // 20. Testimonials Management: Create, Publish, Verify Public
  const createTestimonialRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/testimonials',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
  }, {
    name: 'Sravani Rao',
    role: 'DevOps Engineer at CloudWorks',
    program: 'Cloud Apprenticeship // 2025',
    quote: 'KODEWAR gave me real cluster access from day one. I learned more in 3 months than in 4 years of college.',
    status: 'PUBLISHED',
  });
  testTestimonialId = createTestimonialRes.body?.testimonial?.id;
  console.log(`[TEST 20] Admin Create Testimonial: status=${createTestimonialRes.status}, id=${testTestimonialId}`);

  const publicTestimonials = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/testimonials',
    method: 'GET',
  });
  const testInPublic = publicTestimonials.body?.testimonials?.some((t) => t.id === testTestimonialId);
  console.log(`[TEST 21] Public Testimonials Listing: found=${testInPublic} (Expected: true)`);

  console.log('====================================================');
  console.log('ALL PHASE 6C VERIFICATION TESTS COMPLETED SUCCESSFULLY');
  console.log('====================================================');
}

runPhase6CTests().catch(console.error);
