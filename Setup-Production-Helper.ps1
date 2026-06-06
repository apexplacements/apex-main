# Automated Production Setup - PowerShell Helper

# This script provides helper functions and commands for post-deployment setup

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     APEX SKILLS - PRODUCTION POST-DEPLOYMENT SETUP            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$EC2_HOST = "ec2-13-207-1-159.ap-south-1.compute.amazonaws.com"
$EC2_USER = "ubuntu"
$PEM_FILE = "C:\Users\santh\Website\apex-placements.pem"
$DB_NAME = "apex_placements"
$DB_USER = "root"

Write-Host "AVAILABLE COMMANDS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. SSH to EC2 Instance" -ForegroundColor Cyan
Write-Host "   Command:" -ForegroundColor Gray
Write-Host "   ssh -i ""$PEM_FILE"" $EC2_USER@$EC2_HOST" -ForegroundColor White
Write-Host ""

Write-Host "2. Create Trainer Account" -ForegroundColor Cyan
Write-Host "   Command (run on EC2):" -ForegroundColor Gray
Write-Host @"
mysql -u $DB_USER -p $DB_NAME -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');"
"@ -ForegroundColor White
Write-Host ""

Write-Host "3. Create Student Account" -ForegroundColor Cyan
Write-Host "   Command (run on EC2):" -ForegroundColor Gray
Write-Host @"
mysql -u $DB_USER -p $DB_NAME -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES ('Demo Student', 'std', 'student@apexplacements.in', 'student@123', 'active');"
"@ -ForegroundColor White
Write-Host ""

Write-Host "4. Run LMS Database Migration" -ForegroundColor Cyan
Write-Host "   Command (run on EC2):" -ForegroundColor Gray
Write-Host @"
mysql -u $DB_USER -p $DB_NAME < /path/to/backend/migrations/001_create_lms_schema.sql
"@ -ForegroundColor White
Write-Host ""

Write-Host "5. Verify Accounts Created" -ForegroundColor Cyan
Write-Host "   Command (run on EC2):" -ForegroundColor Gray
Write-Host @"
mysql -u $DB_USER -p $DB_NAME -e "SELECT email, role FROM generated_emails WHERE role IN ('tr', 'std');"
"@ -ForegroundColor White
Write-Host ""

Write-Host "6. Verify LMS Tables Created" -ForegroundColor Cyan
Write-Host "   Command (run on EC2):" -ForegroundColor Gray
Write-Host @"
mysql -u $DB_USER -p $DB_NAME -e "SHOW TABLES;"
"@ -ForegroundColor White
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "COMPLETE SETUP IN ONE COMMAND:" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: SSH to EC2" -ForegroundColor Cyan
Write-Host "Copy and run this in PowerShell:" -ForegroundColor Gray
Write-Host ""
Write-Host "ssh -i ""$PEM_FILE"" $EC2_USER@$EC2_HOST" -ForegroundColor White
Write-Host ""

Write-Host "Step 2: Once logged in to EC2, run these commands:" -ForegroundColor Cyan
Write-Host ""

$commands = @(
    "# Create Trainer Account",
    'mysql -u root -p apex_placements -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES (''Srikanth Trainer'', ''tr'', ''srikanth.tr@apexplacements.in'', ''trainer@123'', ''active'');"',
    "",
    "# Create Student Account",
    'mysql -u root -p apex_placements -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES (''Demo Student'', ''std'', ''student@apexplacements.in'', ''student@123'', ''active'');"',
    "",
    "# Run LMS Migration (if path is correct)",
    "mysql -u root -p apex_placements < ~/APEXSKILLS/backend/migrations/001_create_lms_schema.sql",
    "",
    "# Verify Setup",
    'mysql -u root -p apex_placements -e "SELECT COUNT(*) as accounts FROM generated_emails; SHOW TABLES LIKE ''courses'';"',
    "",
    "# Exit",
    "exit"
)

foreach ($cmd in $commands) {
    Write-Host $cmd -ForegroundColor White
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "TESTING GUIDE:" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "After setup is complete:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Test with HR Account:" -ForegroundColor White
Write-Host "   URL: https://www.apexplacements.in" -ForegroundColor Gray
Write-Host "   Email: srikanth.hr@apexplacements.in" -ForegroundColor Gray
Write-Host "   Password: Srikanth@12#*" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Test with Trainer Account:" -ForegroundColor White
Write-Host "   Email: srikanth.tr@apexplacements.in" -ForegroundColor Gray
Write-Host "   Password: trainer@123" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Test with Student Account:" -ForegroundColor White
Write-Host "   Email: student@apexplacements.in" -ForegroundColor Gray
Write-Host "   Password: student@123" -ForegroundColor Gray
Write-Host ""

Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Documentation:" -ForegroundColor Green
Write-Host "  - POST_DEPLOYMENT_SETUP.md (this file's instructions)" -ForegroundColor Gray
Write-Host "  - PRODUCTION_TEST_REPORT.md (test results)" -ForegroundColor Gray
Write-Host "  - PRODUCTION_DEPLOYMENT_CHECKLIST.md (full checklist)" -ForegroundColor Gray
Write-Host ""

Write-Host "Status: Ready to proceed with setup" -ForegroundColor Green
Write-Host ""
