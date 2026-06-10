const request = require('supertest');
const app = require('../server');

describe('Student Enquiry API', () => {
  it('GET /api/student-enquiry returns success', async () => {
    const res = await request(app).get('/api/student-enquiry');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('POST /api/student-enquiry rejects invalid job_type', async () => {
    const payload = {
      full_name: 'Test User',
      phone: '9999999999',
      email: 'test@example.com',
      job_type: 'invalid-type'
    };
    const res = await request(app).post('/api/student-enquiry').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
