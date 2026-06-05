#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function main() {
  const [,, distFile, backendDomain, backendId] = process.argv;
  if (!distFile || !backendDomain || !backendId) {
    console.error('Usage: node cloudfront_add_api.js <dist-get-json> <backendDomain> <backendId>');
    process.exit(2);
  }

  let raw = fs.readFileSync(distFile, 'utf8');
  raw = raw.replace(/^\uFEFF/, '');
  const obj = JSON.parse(raw);
  const eTag = obj.ETag;
  const cfg = obj.DistributionConfig;

  if (!cfg.Origins) cfg.Origins = { Quantity: 0, Items: [] };
  if (!Array.isArray(cfg.Origins.Items)) cfg.Origins.Items = [];

  let existing = cfg.Origins.Items.find(o => o.DomainName === backendDomain);
  let targetId = backendId;
  if (existing) {
    targetId = existing.Id;
    console.log('Found existing origin, id=', targetId);
  } else {
    const newOrigin = {
      Id: backendId,
      DomainName: backendDomain,
      OriginPath: "",
      CustomHeaders: { Quantity: 0, Items: [] },
      CustomOriginConfig: {
        HTTPPort: 80,
        HTTPSPort: 443,
        OriginProtocolPolicy: 'https-only',
        OriginSslProtocols: { Quantity: 1, Items: ['TLSv1.2'] },
        OriginReadTimeout: 30,
        OriginKeepaliveTimeout: 5,
        IpAddressType: 'ipv4'
      },
      ConnectionAttempts: 3,
      ConnectionTimeout: 10,
      OriginShield: { Enabled: false },
      OriginAccessControlId: ''
    };
    cfg.Origins.Items.push(newOrigin);
    cfg.Origins.Quantity = cfg.Origins.Items.length;
    console.log('Added origin', backendDomain);
  }

  if (!cfg.CacheBehaviors) cfg.CacheBehaviors = { Quantity: 0, Items: [] };
  if (!Array.isArray(cfg.CacheBehaviors.Items)) cfg.CacheBehaviors.Items = [];

  const pathPattern = '/api/*';
  const existingBehavior = cfg.CacheBehaviors.Items.find(b => b.PathPattern === pathPattern);
  const newBehavior = {
    PathPattern: pathPattern,
    TargetOriginId: targetId,
    TrustedSigners: { Enabled: false, Quantity: 0 },
    TrustedKeyGroups: { Enabled: false, Quantity: 0 },
    ViewerProtocolPolicy: 'redirect-to-https',
    AllowedMethods: { Quantity: 7, Items: ['HEAD','GET','OPTIONS','PUT','PATCH','POST','DELETE'], CachedMethods: { Quantity: 2, Items: ['HEAD','GET'] } },
    SmoothStreaming: false,
    Compress: true,
    LambdaFunctionAssociations: { Quantity: 0, Items: [] },
    FunctionAssociations: { Quantity: 0, Items: [] },
    FieldLevelEncryptionId: '',
    CachePolicyId: '413dc41d-256b-4e13-8b19-5d1e03f6c023',
    OriginRequestPolicyId: '88a5eaf4-2fd4-4709-b370-b4c650ea3fcf',
    ResponseHeadersPolicyId: ''
  };

  if (existingBehavior) {
    const idx = cfg.CacheBehaviors.Items.indexOf(existingBehavior);
    cfg.CacheBehaviors.Items[idx] = newBehavior;
    console.log('Updated existing cache behavior for', pathPattern);
  } else {
    cfg.CacheBehaviors.Items.push(newBehavior);
    cfg.CacheBehaviors.Quantity = cfg.CacheBehaviors.Items.length;
    console.log('Added cache behavior for', pathPattern);
  }

  const out = JSON.stringify(cfg, null, 2);
  const outPath = path.join(path.dirname(distFile), 'dist-config-updated.json');
  fs.writeFileSync(outPath, out, 'utf8');
  console.log('Wrote updated config to', outPath);
  console.log('ETag:', eTag);
}

main().catch(e=>{ console.error(e); process.exit(1); });
