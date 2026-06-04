const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env'), override: true });
const parseS3Bucket = (raw) => {
  if (!raw) return undefined;
  const urlMatch = raw.match(/\/buckets\/([^\/?]+)/);
  return urlMatch ? urlMatch[1] : raw;
};
console.log('AWS_S3_BUCKET_NAME=', process.env.AWS_S3_BUCKET_NAME);
console.log('AWS_REGION=', process.env.AWS_REGION);
console.log('parsed=', parseS3Bucket(process.env.AWS_S3_BUCKET_NAME));
