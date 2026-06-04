const http = require('http');

const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
const title = 'Test Upload';
const resourceType = 'Notes';
const fileName = 'test.txt';
const fileContent = 'Hello from upload test';

const parts = [];
function appendField(name, value) {
  parts.push(Buffer.from(`--${boundary}\r\n`));
  parts.push(Buffer.from(`Content-Disposition: form-data; name="${name}"\r\n\r\n`));
  parts.push(Buffer.from(`${value}\r\n`));
}
function appendFile(name, filename, content) {
  parts.push(Buffer.from(`--${boundary}\r\n`));
  parts.push(Buffer.from(`Content-Disposition: form-data; name="${name}"; filename="${filename}"\r\n`));
  parts.push(Buffer.from(`Content-Type: text/plain\r\n\r\n`));
  parts.push(Buffer.from(content));
  parts.push(Buffer.from(`\r\n`));
}
appendField('title', title);
appendField('resourceType', resourceType);
appendFile('file', fileName, fileContent);
parts.push(Buffer.from(`--${boundary}--\r\n`));

const body = Buffer.concat(parts);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/upload-resource',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length,
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', data);
  });
});
req.on('error', (err) => {
  console.error('ERROR', err);
});
req.write(body);
req.end();
