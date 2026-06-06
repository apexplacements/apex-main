# Simple Production Deployment Script
# Usage: .\Deploy-Prod-Simple.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "APEX PRODUCTION DEPLOYMENT" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$FRONTEND_PATH = "C:\Users\santh\Website\APEXSKILLS\frontend\apex-app"
$S3_BUCKET = "www.apexplacements.in"
$CLOUDFRONT_ID = "EJH7XW8Q93MKB"

# Step 1: Build
Write-Host ""
Write-Host "STEP 1: Building frontend..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

Push-Location $FRONTEND_PATH
npm install --legacy-peer-deps 2>&1 | Out-Null
npm run build 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Build successful" -ForegroundColor Green
Pop-Location

# Step 2: Deploy to S3
Write-Host ""
Write-Host "STEP 2: Deploying to S3..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

$DIST_PATH = "$FRONTEND_PATH\dist"

Write-Host "Syncing dist to S3..." -ForegroundColor Cyan
& aws s3 sync $DIST_PATH "s3://$S3_BUCKET/" --delete 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 sync failed" -ForegroundColor Red
    exit 1
}

Write-Host "S3 sync successful" -ForegroundColor Green

# Step 3: Invalidate CloudFront
Write-Host ""
Write-Host "STEP 3: Invalidating CloudFront..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

Write-Host "Creating invalidation..." -ForegroundColor Cyan
& aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*" 2>&1

Write-Host "CloudFront invalidation created" -ForegroundColor Green
Write-Host "Waiting for cache update..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Step 4: Verify
Write-Host ""
Write-Host "STEP 4: Verifying deployment..." -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Yellow

Write-Host ""
Write-Host "Test 1: Frontend accessibility" -ForegroundColor Cyan
try {
    $resp = Invoke-WebRequest -Uri "https://www.apexplacements.in" -TimeoutSec 10
    Write-Host "SUCCESS: Frontend live (HTTP $($resp.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Frontend not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test 2: API accessibility" -ForegroundColor Cyan
try {
    $api = Invoke-RestMethod -Uri "https://api.apexplacements.in/api/students" -Method GET -TimeoutSec 10
    Write-Host "SUCCESS: API responding" -ForegroundColor Green
} catch {
    Write-Host "ERROR: API not responding" -ForegroundColor Red
}

Write-Host ""
Write-Host "Test 3: Login endpoint" -ForegroundColor Cyan
try {
    $loginBody = @{
        email = "srikanth.hr@apexplacements.in"
        password = "Srikanth@12#*"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "https://api.apexplacements.in/api/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -TimeoutSec 10

    if ($login.success) {
        Write-Host "SUCCESS: Login working" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR: Login endpoint error" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: https://www.apexplacements.in" -ForegroundColor Green
Write-Host "API: https://api.apexplacements.in/api" -ForegroundColor Green
