param(
  [Parameter(Mandatory=$true)]
  [string]$DistributionId,

  [Parameter(Mandatory=$true)]
  [string]$BackendOriginDomain,

  [string]$BackendOriginId = "api-backend-origin",

  [ValidateSet("https-only", "http-only", "match-viewer")]
  [string]$OriginProtocolPolicy = "https-only"
)

function Get-JsonContent {
  param([string]$Command)
  $raw = Invoke-Expression $Command
  return $raw | ConvertFrom-Json
}

Write-Host "Fetching CloudFront distribution config for $DistributionId..."
$dist = Get-JsonContent "aws cloudfront get-distribution-config --id $DistributionId"
$eTag = ($dist.ETag -replace '"', '')
$cfg = $dist.DistributionConfig

if (-not $cfg.Origins) {
  throw "Distribution config does not contain Origins"
}

# Ensure origins list is initialized.
if (-not $cfg.Origins.Items) {
  $cfg.Origins.Items = @()
  $cfg.Origins.Quantity = 0
}

$existingOrigin = $cfg.Origins.Items | Where-Object { $_.DomainName -eq $BackendOriginDomain }
if ($existingOrigin) {
  Write-Host "Found existing origin for domain $BackendOriginDomain with ID $($existingOrigin.Id)"
  $backendOriginId = $existingOrigin.Id
} else {
  Write-Host "Adding backend origin $BackendOriginDomain as $BackendOriginId"
  $newOrigin = @{
    Id = $BackendOriginId
    DomainName = $BackendOriginDomain
    OriginPath = ""
    CustomHeaders = @{ Quantity = 0; Items = @() }
    CustomOriginConfig = @{
      HTTPPort = 80
      HTTPSPort = 443
      OriginProtocolPolicy = $OriginProtocolPolicy
      OriginSslProtocols = @{ Quantity = 4; Items = @("SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2") }
      OriginReadTimeout = 30
      OriginKeepaliveTimeout = 5
      IpAddressType = "ipv4"
    }
    ConnectionAttempts = 3
    ConnectionTimeout = 10
    OriginShield = @{ Enabled = $false }
    OriginAccessControlId = ""
  }
  $cfg.Origins.Items += $newOrigin
  $cfg.Origins.Quantity = $cfg.Origins.Items.Count
}

if (-not $cfg.CacheBehaviors) {
  $cfg.CacheBehaviors = @{ Quantity = 0; Items = @() }
}
if (-not $cfg.CacheBehaviors.Items) {
  $cfg.CacheBehaviors.Items = @()
}

$pathPattern = "/api/*"
$existingBehavior = $cfg.CacheBehaviors.Items | Where-Object { $_.PathPattern -eq $pathPattern }

$newBehavior = @{
  PathPattern = $pathPattern
  TargetOriginId = $backendOriginId
  TrustedSigners = @{ Enabled = $false; Quantity = 0 }
  TrustedKeyGroups = @{ Enabled = $false; Quantity = 0 }
  ViewerProtocolPolicy = "redirect-to-https"
  AllowedMethods = @{ Quantity = 7; Items = @("HEAD", "GET", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"); CachedMethods = @{ Quantity = 2; Items = @("HEAD", "GET") } }
  SmoothStreaming = $false
  Compress = $true
  LambdaFunctionAssociations = @{ Quantity = 0; Items = @() }
  FunctionAssociations = @{ Quantity = 0; Items = @() }
  FieldLevelEncryptionId = ""
  CachePolicyId = "413dc41d-256b-4e13-8b19-5d1e03f6c023"
  OriginRequestPolicyId = "88a5eaf4-2fd4-4709-b370-b4c650ea3fcf"
  ResponseHeadersPolicyId = ""
}

if ($existingBehavior) {
  Write-Host "Updating existing cache behavior for $pathPattern"
  $index = $cfg.CacheBehaviors.Items.IndexOf($existingBehavior)
  $cfg.CacheBehaviors.Items[$index] = $newBehavior
} else {
  Write-Host "Adding cache behavior for $pathPattern"
  $cfg.CacheBehaviors.Items += $newBehavior
  $cfg.CacheBehaviors.Quantity = $cfg.CacheBehaviors.Items.Count
}

$tempFile = [System.IO.Path]::GetTempFileName()
$cfg | ConvertTo-Json -Depth 20 | Set-Content -Path $tempFile -Encoding utf8NoBOM

Write-Host "Updating distribution $DistributionId with new API origin and cache behavior..."
aws cloudfront update-distribution --id $DistributionId --if-match $eTag --distribution-config file://$tempFile

Remove-Item $tempFile -Force
Write-Host "Update complete. Remember to invalidate cache after the origin change."
