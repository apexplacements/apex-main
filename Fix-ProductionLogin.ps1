# PowerShell Script to Fix Production Login
# Run in PowerShell as Administrator

Write-Host "=== Production Login Fix ===" -ForegroundColor Cyan
Write-Host ""

# Configuration
$PEM_FILE = "C:\Users\santh\Website\apex-placements.pem"
$EC2_USER = "ubuntu"
$EC2_HOST = "ec2-13-207-1-159.ap-south-1.compute.amazonaws.com"
$EMAIL = "srikanth.tr@apexplacements.in"
$PASSWORD = "trainer@123"

Write-Host "Step 1: Testing Production Connection..." -ForegroundColor Yellow

try {
    $result = ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "echo OK"
    if ($result -eq "OK") {
        Write-Host "✓ Connected to production server" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Connection failed" -ForegroundColor Red
    Write-Host "Check: PEM file path: $PEM_FILE" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 2: Creating Trainer Account in Production..." -ForegroundColor Yellow

$sqlCommand = @"
USE apex_placements;
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', '$EMAIL', '$PASSWORD', 'active', NOW())
ON DUPLICATE KEY UPDATE status = 'active';
"@

try {
    ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "mysql -u root -p -e '$sqlCommand'"
    Write-Host "✓ Account created/updated" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to create account" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 3: Verifying Account Creation..." -ForegroundColor Yellow

$verifySQL = "SELECT email, role, default_password FROM generated_emails WHERE email = '$EMAIL';"

try {
    $output = ssh -i $PEM_FILE "$EC2_USER@$EC2_HOST" "mysql -u root -p apex_placements -e '$verifySQL'"
    Write-Host "✓ Account verified:" -ForegroundColor Green
    Write-Host $output
} catch {
    Write-Host "✗ Verification failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 4: Testing Login Endpoint..." -ForegroundColor Yellow

try {
    $loginTest = Invoke-RestMethod -Uri "https://api.apexplacements.in/api/login" `
        -Method POST `
        -Body (@{ email = $EMAIL; password = $PASSWORD } | ConvertTo-Json) `
        -ContentType "application/json" `
        -TimeoutSec 10

    if ($loginTest.success) {
        Write-Host "✓ Login successful!" -ForegroundColor Green
        Write-Host "  User: $($loginTest.data.user_name)" -ForegroundColor Green
        Write-Host "  Role: $($loginTest.data.role)" -ForegroundColor Green
    } else {
        Write-Host "✗ Login failed: $($loginTest.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Login test error" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "  Email:    $EMAIL" -ForegroundColor White
Write-Host "  Password: $PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "Frontend:   https://www.apexplacements.in" -ForegroundColor Green
Write-Host "Backend:    https://api.apexplacements.in" -ForegroundColor Green
Write-Host ""
Write-Host "Try logging in now!" -ForegroundColor Cyan
