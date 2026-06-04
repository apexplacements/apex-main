const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/batches',
  method: 'GET'
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
req.end();
