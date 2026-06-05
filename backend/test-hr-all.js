const baseUrl = 'http://127.0.0.1:5000/api';

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`Invalid JSON from ${url}: ${text}`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${url}: ${JSON.stringify(json)}`);
  }
  return json;
};

const now = Date.now();
const marker = `HR-TEST-${now}`;

const main = async () => {
  const result = { created: {}, retrieved: {}, errors: [] };

  const create = async (path, payload) => {
    const json = await fetchJson(`${baseUrl}/${path}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return json;
  };

  const getAll = async (path) => {
    return await fetchJson(`${baseUrl}/${path}`);
  };

  try {
    const studentPayload = {
      name: `Test Student ${marker}`,
      mobile: '9999999999',
      email: `hr-test-${now}@example.com`,
      course: 'Test Course',
      batch: 'Morning',
      status: 'Active',
    };
    const studentCreate = await create('students', studentPayload);
    result.created.student = { id: studentCreate.id, payload: studentPayload };

    const companyPayload = {
      company_name: `Test Company ${marker}`,
      website: 'https://example.com',
      hr_name: 'Test HR',
      hr_email: `hr+${now}@example.com`,
      hr_mobile: '8888888888',
      location: 'Test City',
      logo_url: 'https://example.com/logo.png',
    };
    const companyCreate = await create('companies', companyPayload);
    result.created.company = { id: companyCreate.id, payload: companyPayload };

    const placementDrivePayload = {
      company_name: `Test Company ${marker}`,
      role_name: 'Test Role',
      location: 'Remote',
      ctc: '10 LPA',
      interview_date: new Date().toISOString().slice(0, 10),
      eligibility: 'Any graduate',
      status: 'Active',
    };
    const placementDriveCreate = await create('placement-drives', placementDrivePayload);
    result.created.placementDrive = { id: placementDriveCreate.id, payload: placementDrivePayload };

    const jobPayload = {
      company_name: `Test Company ${marker}`,
      role_name: 'Test Job Role',
      experience: '0-1 years',
      location: 'Remote',
      salary: '15 LPA',
      description: 'Test job posting',
      apply_link: 'https://example.com/apply',
      last_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
    const jobCreate = await create('jobs', jobPayload);
    result.created.job = { id: jobCreate.id, payload: jobPayload };

    const interviewPayload = {
      student_id: result.created.student.id,
      company_id: result.created.company.id,
      interview_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      interview_time: '10:00:00',
      round_name: 'Technical',
      mode: 'Online',
      status: 'Scheduled',
    };
    const interviewCreate = await create('interviews', interviewPayload);
    result.created.interview = { id: interviewCreate.id, payload: interviewPayload };

    const placementPayload = {
      student_id: result.created.student.id,
      company_name: `Test Company ${marker}`,
      role_name: 'Placed Role',
      package: '12 LPA',
      placement_status: 'Placed',
    };
    const placementCreate = await create('placements', placementPayload);
    result.created.placement = { id: placementCreate.id, payload: placementPayload };

    const resumePayload = {
      student_id: result.created.student.id,
      resume_url: `https://example.com/resume-${marker}.pdf`,
      status: 'Pending',
    };
    const resumeCreate = await create('resumes', resumePayload);
    result.created.resume = { id: resumeCreate.id, payload: resumePayload };

    const notificationPayload = {
      title: `Test Notification ${marker}`,
      message: 'This is a test notification.',
      notification_type: 'Interview Schedule',
      student_id: result.created.student.id,
      company_id: result.created.company.id,
    };
    const notificationCreate = await create('notifications', notificationPayload);
    result.created.notification = { id: notificationCreate.id, payload: notificationPayload };

    const paymentPayload = {
      payment_type: 'Course Fee',
      payer_name: `Test Payer ${marker}`,
      payee_name: `Test Payee ${marker}`,
      amount: 5000,
      currency: 'INR',
      category: 'Course Fee',
      reference: `REF-${marker}`,
      status: 'Completed',
      payment_date: new Date().toISOString().slice(0, 10),
      notes: 'Test payment record',
    };
    const paymentCreate = await create('payments', paymentPayload);
    result.created.payment = { id: paymentCreate.id, payload: paymentPayload };

    const endpoints = [
      'students',
      'companies',
      'placement-drives',
      'jobs',
      'interviews',
      'placements',
      'resumes',
      'notifications',
      'payments',
    ];

    for (const path of endpoints) {
      const list = await getAll(path);
      result.retrieved[path] = list.data.filter((item) => {
        return JSON.stringify(item).includes(marker) ||
          (item.payee_name && item.payee_name.includes(marker)) ||
          (item.payer_name && item.payer_name.includes(marker));
      });
    }

    console.log('HR API insert/retrieve test results:');
    for (const [key, created] of Object.entries(result.created)) {
      const path = key === 'placementDrive' ? 'placement-drives' : `${key}s`;
      const found = result.retrieved[path] || [];
      console.log(`- ${key}: created id=${created.id}, retrieved count=${found.length}`);
    }

    console.log('\nDetailed retrieval check:');
    for (const [path, items] of Object.entries(result.retrieved)) {
      console.log(`  ${path}: ${items.length} matching items`);
      if (items.length > 0) {
        console.log(`    first: ${JSON.stringify(items[0])}`);
      }
    }

    if (result.errors.length) {
      console.error('\nErrors:', result.errors);
      process.exit(1);
    }
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

main();
