const http = require('http');

const data = JSON.stringify({
  course_name: 'Automated Test Course',
  trainer_name: 'Tester',
  start_date: '2026-06-02',
  end_date: '2026-06-10'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/batches',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('BODY:', body);
  });
});

req.on('error', (e) => console.error('Request error:', e));
req.write(data);
req.end();
