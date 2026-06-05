# vliapp

## CloudFront API routing helper

Use `cloudfront-add-api-origin.ps1` to add a backend origin and a `/api/*` cache behavior to your CloudFront distribution.

Example:

```powershell
.\cloudfront-add-api-origin.ps1 -DistributionId EJH7XW8Q93MKB -BackendOriginDomain backend.apexplacements.in -BackendOriginId apex-backend-origin
```

This will:
- add a new CloudFront origin for your backend host
- add or update a cache behavior for `/api/*`
- allow GET, HEAD, OPTIONS, PUT, PATCH, POST, DELETE
- use the managed CloudFront caching/forwarding policy for API traffic

After running the script, create a CloudFront invalidation for `/*`.
