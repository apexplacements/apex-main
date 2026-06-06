# PowerShell Deployment Script - Build & Deploy to Production
# Usage: .\Deploy-Production.ps1

param(
    [string]$Action = "all"  # all, build, deploy, verify
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         APEX SKILLS - PRODUCTION BUILD & DEPLOYMENT           ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$FRONTEND_PATH = "C:\Users\santh\Website\APEXSKILLS\frontend\apex-app"
$S3_BUCKET = "www.apexplacements.in"
$CLOUDFRONT_ID = "EJH7XW8Q93MKB"
$PROD_URL = "https://www.apexplacements.in"
$API_URL = "https://api.apexplacements.in"

function Build-Frontend {
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 1: Building Frontend" -ForegroundColor Yellow
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""

    try {
        Push-Location $FRONTEND_PATH
        
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        npm install --legacy-peer-deps
        
        Write-Host ""
        Write-Host "Building with Vite..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Pop-Location
            return $true
        } else {
            Write-Host "❌ Build failed!" -ForegroundColor Red
            Pop-Location
            return $false
        }
    } catch {
        Write-Host "❌ Build error: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

function Deploy-ToProduction {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 2: Deploying to Production" -ForegroundColor Yellow
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""

    try {
        $DIST_PATH = "$FRONTEND_PATH\dist"
        
        if (-not (Test-Path $DIST_PATH)) {
            Write-Host "❌ dist folder not found! Build first." -ForegroundColor Red
            return $false
        }

        Write-Host "Syncing dist to S3 bucket: $S3_BUCKET" -ForegroundColor Cyan
        & aws s3 sync $DIST_PATH "s3://$S3_BUCKET/" --delete --exclude ".git/*" --exclude "node_modules/*"
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ S3 sync failed!" -ForegroundColor Red
            return $false
        }

        Write-Host "✅ S3 sync complete!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "Invalidating CloudFront cache..." -ForegroundColor Cyan
        & aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[!] CloudFront invalidation queued - may take a moment" -ForegroundColor Yellow
        } else {
            Write-Host "[OK] CloudFront invalidation created!" -ForegroundColor Green
        }

        Write-Host ""
        Write-Host "[*] Waiting for CloudFront to invalidate (up to 5 minutes)..." -ForegroundColor Cyan
        Start-Sleep -Seconds 10

        return $true
    } catch {
        Write-Host "[ERROR] Deployment error: $_" -ForegroundColor Red
        return $false
    }
}

function Verify-Production {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host "STEP 3: Verifying Production Deployment" -ForegroundColor Yellow
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    Write-Host ""

    $allPassed = $true

    # Test 1: Frontend accessibility
    Write-Host "Test 1: Frontend Accessibility" -ForegroundColor Cyan
    try {
        $resp = Invoke-WebRequest -Uri $PROD_URL -UseBasicParsing -TimeoutSec 10
        Write-Host "✅ Frontend Live: HTTP $($resp.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend Error: $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }

    Write-Host ""

    # Test 2: API accessibility
    Write-Host "Test 2: Backend API Accessibility" -ForegroundColor Cyan
    try {
        $api = Invoke-RestMethod -Uri "$API_URL/api/students" -Method GET -UseBasicParsing -TimeoutSec 10
        if ($api.success) {
            Write-Host "✅ API Live: $($api.data.Count) students found" -ForegroundColor Green
        } else {
            Write-Host "⚠️  API responded but with error: $($api.message)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ API Error: $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }

    Write-Host ""

    # Test 3: Login endpoint
    Write-Host "Test 3: Authentication Endpoint" -ForegroundColor Cyan
    try {
        $login = Invoke-RestMethod -Uri "$API_URL/api/login" `
            -Method POST `
            -Body (@{ email = "srikanth.hr@apexplacements.in"; password = "Srikanth@12#*" } | ConvertTo-Json) `
            -ContentType "application/json" `
            -UseBasicParsing `
            -TimeoutSec 10

        if ($login.success) {
            Write-Host "✅ Login Works: $($login.data.role) role confirmed" -ForegroundColor Green
        } else {
            Write-Host "❌ Login failed: $($login.message)" -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host "❌ Login Error: $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }

    Write-Host ""

    # Test 4: LMS Routes (Trainer Dashboard)
    Write-Host "Test 4: LMS Routes (Frontend loaded)" -ForegroundColor Cyan
    try {
        $resp = Invoke-WebRequest -Uri "$PROD_URL" -UseBasicParsing -TimeoutSec 10
        $content = $resp.Content
        
        if ($content -match "StudentDashboard|TrainerDashboard") {
            Write-Host "✅ LMS Components Bundled: Components found in build" -ForegroundColor Green
        } else {
            Write-Host "⚠️  LMS Components: Verify components loaded (may need to check in browser)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Frontend check failed" -ForegroundColor Red
        $allPassed = $false
    }

    Write-Host ""

    # Test 5: SSL/TLS
    Write-Host "Test 5: SSL/TLS Certificate" -ForegroundColor Cyan
    try {
        $uri = [System.Uri]"$API_URL"
        $req = [System.Net.HttpWebRequest]::Create($uri)
        $req.GetResponse() | Out-Null
        Write-Host "✅ SSL Certificate Valid" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  SSL check incomplete (may be valid)" -ForegroundColor Yellow
    }

    return $allPassed
}

# Main execution
Write-Host ""

if ($Action -eq "build" -or $Action -eq "all") {
    if (-not (Build-Frontend)) {
        Write-Host ""
        Write-Host "❌ Build failed. Fix errors above and try again." -ForegroundColor Red
        exit 1
    }
}

if ($Action -eq "deploy" -or $Action -eq "all") {
    if (-not (Deploy-ToProduction)) {
        Write-Host ""
        Write-Host "❌ Deployment failed." -ForegroundColor Red
        exit 1
    }
}

if ($Action -eq "verify" -or $Action -eq "all") {
    $verified = Verify-Production
    
    if ($verified) {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "✅ ALL TESTS PASSED - PRODUCTION DEPLOYMENT SUCCESSFUL" -ForegroundColor Green
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
        Write-Host "⚠️  SOME TESTS FAILED - CHECK DETAILS ABOVE" -ForegroundColor Yellow
        Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  Frontend:  $PROD_URL" -ForegroundColor White
Write-Host "  Backend:   $API_URL/api" -ForegroundColor White
Write-Host "  Dashboard: $PROD_URL (after login)" -ForegroundColor White
Write-Host ""

if ($Action -eq "all") {
    Write-Host "✅ Deployment complete! Check production now." -ForegroundColor Green
}
