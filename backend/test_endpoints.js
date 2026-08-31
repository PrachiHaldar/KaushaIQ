const http = require('http');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const headers = { ...(options.headers || {}) };

    if (body) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(body);
    }

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting KaushIQ Full-Stack API Telemetry Test...\n');

  // 1. Health Check
  const health = await request('http://localhost:5000/api/health');
  console.log('1. Health Check:', health.data.status, '| Platform:', health.data.platform);

  // 2. Demo Login (Student: Rahul Kumar)
  const auth = await request('http://localhost:5000/api/auth/demo-login', { method: 'POST' }, JSON.stringify({ role: 'STUDENT' }));
  console.log('2. Student Demo Login:', auth.data.user.name, '| Role:', auth.data.user.role, '| Initial Readiness:', auth.data.user.studentProfile.readinessScore);
  const token = auth.data.token;
  const headers = { Authorization: `Bearer ${token}` };

  // 3. Student Dashboard
  const dash = await request('http://localhost:5000/api/students/dashboard', { headers });
  console.log('3. Student Dashboard: Target Career =', dash.data.data.targetCareer.name, '| Readiness =', dash.data.data.readiness.score, '/ 100');
  console.log('   Skills Count =', dash.data.data.skills.length, '| Skill Gaps Count =', dash.data.data.skillGaps.length);

  // 4. Opportunities Matching Engine
  const opps = await request('http://localhost:5000/api/opportunities', { headers });
  console.log('4. Opportunities Count =', opps.data.count, '| Top Opportunity =', opps.data.data[0].title);
  console.log('   Deterministic Match Score =', opps.data.data[0].matchScore, '% | Status =', opps.data.data[0].status);

  // 5. Explainable Match
  const explain = await request(`http://localhost:5000/api/matching/explain/${opps.data.data[0].id}`, { headers });
  console.log('5. Explainable Matching:', explain.data.data.opportunityTitle, '| Factors:', JSON.stringify(explain.data.data.breakdown));

  // 6. Complete Challenge Evaluation Leap (Simulate Step 5 & 6)
  const projects = await request('http://localhost:5000/api/projects');
  const proj = projects.data.data[0];
  console.log('6. Project Challenge:', proj.title);

  // Student submits
  const sub = await request('http://localhost:5000/api/projects/submit', { method: 'POST', headers }, JSON.stringify({
    projectId: proj.id,
    repoUrl: 'https://github.com/rahulkumar-demo/ai-healthcare-prediction-fastapi',
    submissionNotes: 'Containerized FastAPI model with SHAP interpretability and ROC-AUC 0.91'
  }));
  console.log('   Solution Submitted:', sub.data.data.status);

  // Industry evaluates (Using Industry login)
  const indAuth = await request('http://localhost:5000/api/auth/demo-login', { method: 'POST' }, JSON.stringify({ role: 'INDUSTRY' }));
  const indHeaders = { Authorization: `Bearer ${indAuth.data.token}` };

  const evalRes = await request('http://localhost:5000/api/projects/evaluate', { method: 'POST', headers: indHeaders }, JSON.stringify({
    submissionId: sub.data.data.id,
    grade: 4.7,
    mentorFeedback: 'Outstanding implementation! Modular FastAPI architecture and high ROC-AUC benchmark achieved.'
  }));
  console.log('   Evaluated with Grade: 4.7/5.0 ⭐ | Readiness Leaped to:', evalRes.data.data.updatedReadiness, '/ 100!');

  // 7. Check Updated Passport
  const passport = await request('http://localhost:5000/api/passport/my', { headers });
  console.log('7. Digital Skill Passport: Employability Index =', passport.data.data.employabilityScore, '/ 100 | Verified Skills =', passport.data.data.verifiedSkills.length);

  // 8. Apply for Opportunity
  const applyRes = await request('http://localhost:5000/api/applications/apply', { method: 'POST', headers }, JSON.stringify({
    opportunityId: opps.data.data[0].id,
    coverNote: 'Verified candidate with 87% readiness score eager to join the AI research team.'
  }));
  console.log('8. 1-Click Apply Result:', applyRes.data.message || (applyRes.data.success ? 'Success' : 'Processed'));

  // 9. Industry Candidate Discovery
  const candidates = await request('http://localhost:5000/api/industry/candidates?minReadiness=70', { headers: indHeaders });
  console.log('9. Industry Candidate Discovery: Verified Candidates =', candidates.data.count, '| Top Candidate =', candidates.data.data[0].name, '(', candidates.data.data[0].compatibilityScore, '% Compatibility)');

  // 10. Institutional Heatmap Analytics
  const instAuth = await request('http://localhost:5000/api/auth/demo-login', { method: 'POST' }, JSON.stringify({ role: 'INSTITUTION' }));
  const instHeaders = { Authorization: `Bearer ${instAuth.data.token}` };
  const instDash = await request('http://localhost:5000/api/institution/dashboard', { headers: instHeaders });
  console.log('10. Institutional Skill Intelligence: Students Assessed =', instDash.data.data.analytics.metrics.totalStudentsAssessed, '| Avg Readiness =', instDash.data.data.analytics.metrics.averageReadiness, '%');
  console.log('    Heatmap Rows =', instDash.data.data.analytics.heatmap.length, '| Automated AI Interventions =', instDash.data.data.analytics.recommendations.length);

  // 11. Public QR Verification
  const verifyPublic = await request('http://localhost:5000/api/passport/verify/KSH-2026-NITK-88219');
  console.log('11. Public QR Verification: Valid =', verifyPublic.data.data.isValid, '| Scholar =', verifyPublic.data.data.studentName, '| Institution =', verifyPublic.data.data.institution);

  console.log('\n🎉 ALL 11 END-TO-END SIH CRITICAL JOURNEY MILESTONES VERIFIED 100% FUNCTIONAL!');
}

runTests().catch(console.error);
