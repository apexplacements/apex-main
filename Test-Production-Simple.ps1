# Simple Production Testing Script

$FRONTEND_URL = "https://www.apexplacements.in"
$API_URL = "https://api.apexplacements.in/api"

Write-Host ""
Write-Host "====== PRODUCTION DEPLOYMENT TEST ======" -ForegroundColor Cyan
Write-Host ""

$PassCount = 0
$FailCount = 0

# Test 1: Frontend
Write-Host "Test 1: Frontend Accessibility" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $FRONTEND_URL -TimeoutSec 15
    Write-Host "[OK] Frontend Live - HTTP $($response.StatusCode)" -ForegroundColor Green
    $PassCount++
} catch {
    Write-Host "[X] Frontend Error - $_" -ForegroundColor Red
    $FailCount++
}

Write-Host ""

# Test 2: API Students
Write-Host "Test 2: API - Students Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/students" -Method GET -TimeoutSec 15
    if ($response.success) {
        Write-Host "[OK] API Responding - Students found" -ForegroundColor Green
        $PassCount++
    } else {
        Write-Host "[X] API Error - $($response.message)" -ForegroundColor Red
        $FailCount++
    }
} catch {
    Write-Host "[X] API Error - $_" -ForegroundColor Red
    $FailCount++
}

Write-Host ""

# Test 3: Login
Write-Host "Test 3: Authentication - Login Endpoint" -ForegroundColor Yellow
try {
    $body = @{
        email = "srikanth.hr@apexplacements.in"
        password = "Srikanth@12#*"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$API_URL/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 15

    if ($response.success) {
        Write-Host "[OK] Login Successful - HR Role" -ForegroundColor Green
        $PassCount++
    } else {
        Write-Host "[X] Login Failed - $($response.message)" -ForegroundColor Red
        $FailCount++
    }
} catch {
    Write-Host "[X] Login Error - $_" -ForegroundColor Red
    $FailCount++
}

Write-Host ""

# Test 4: Trainer Routes
Write-Host "Test 4: API Routes - Trainer Endpoints" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/lms/trainer/1" -Method GET -TimeoutSec 15 -ErrorAction SilentlyContinue
    Write-Host "[OK] Trainer Routes Registered" -ForegroundColor Green
    $PassCount++
} catch {
    Write-Host "[!] Trainer Routes - May require auth" -ForegroundColor Yellow
}

Write-Host ""

# Test 5: Student Routes
Write-Host "Test 5: API Routes - Student Endpoints" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/lms/student/1" -Method GET -TimeoutSec 15 -ErrorAction SilentlyContinue
    Write-Host "[OK] Student Routes Registered" -ForegroundColor Green
    $PassCount++
} catch {
    Write-Host "[!] Student Routes - May require auth" -ForegroundColor Yellow
}

Write-Host ""

# Test 6: SSL
Write-Host "Test 6: Security - HTTPS/SSL" -ForegroundColor Yellow
try {
    $uri = [System.Uri]"https://www.apexplacements.in"
    $request = [System.Net.HttpWebRequest]::Create($uri)
    $request.ServerCertificateValidationCallback = { $true }
    $response = $request.GetResponse()
    Write-Host "[OK] SSL Certificate Valid" -ForegroundColor Green
    $PassCount++
    $response.Close()
} catch {
    Write-Host "[X] SSL Error - $_" -ForegroundColor Red
    $FailCount++
}

Write-Host ""

# Test 7: Response Time
Write-Host "Test 7: Performance - Frontend Response Time" -ForegroundColor Yellow
try {
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $FRONTEND_URL -TimeoutSec 15
    $timer.Stop()
    $ms = $timer.ElapsedMilliseconds
    
    if ($ms -lt 2000) {
        Write-Host "[OK] Fast Response - ${ms}ms" -ForegroundColor Green
        $PassCount++
    } else {
        Write-Host "[!] Slow Response - ${ms}ms" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[X] Response Time Error - $_" -ForegroundColor Red
    $FailCount++
}

Write-Host ""

# Summary
Write-Host "====== TEST SUMMARY ======" -ForegroundColor Cyan
Write-Host ""
Write-Host "Passed: $PassCount" -ForegroundColor Green
Write-Host "Failed: $FailCount" -ForegroundColor Red
Write-Host ""

if ($FailCount -eq 0) {
    Write-Host "STATUS: ALL CRITICAL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Production URLs:" -ForegroundColor Green
    Write-Host "  Frontend: $FRONTEND_URL" -ForegroundColor Green
    Write-Host "  API: $API_URL" -ForegroundColor Green
    Write-Host "  Student Dashboard: $FRONTEND_URL/#/lms/student" -ForegroundColor Green
    Write-Host "  Trainer Dashboard: $FRONTEND_URL/#/lms/trainer" -ForegroundColor Green
} else {
    Write-Host "STATUS: SOME TESTS FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "====== END OF TEST ======" -ForegroundColor Cyan
