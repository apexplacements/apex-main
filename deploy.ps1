# PowerShell Deployment Script for Apex HR Portal Backend
# Run this on Windows to upload backend to EC2

param(
    [string]$EC2Host = "ec2-13-207-1-159.ap-south-1.compute.amazonaws.com",
    [string]$KeyPath = "",
    [string]$BackendPath = "$PSScriptRoot\backend"
)

function Write-Status {
    param([string]$Message, [string]$Status = "INFO")
    $color = switch($Status) {
        "SUCCESS" { "Green" }
        "ERROR" { "Red" }
        "WARNING" { "Yellow" }
        default { "White" }
    }
    Write-Host "[$Status] $Message" -ForegroundColor $color
}

# Verify backend path exists
if (-not (Test-Path $BackendPath)) {
    Write-Status "Backend directory not found at: $BackendPath" -Status "ERROR"
    exit 1
}

if (-not $KeyPath) {
    Write-Status "Please provide the path to your EC2 key pair (apex-placements.pem)" -Status "WARNING"
    $KeyPath = Read-Host "Enter full path to apex-placements.pem"
}

if (-not (Test-Path $KeyPath)) {
    Write-Status "Key file not found at: $KeyPath" -Status "ERROR"
    exit 1
}

Write-Status "Starting deployment to EC2" -Status "INFO"
Write-Host "EC2 Host: $EC2Host"
Write-Host "Key Path: $KeyPath"
Write-Host "Backend Path: $BackendPath"
Write-Host ""

# Step 1: Upload backend code
Write-Status "Uploading backend code to EC2..." -Status "INFO"
scp -i $KeyPath -r "$BackendPath" "ubuntu@${EC2Host}:/home/ubuntu/apex-backend"
if ($LASTEXITCODE -ne 0) {
    Write-Status "Failed to upload backend code" -Status "ERROR"
    exit 1
}
Write-Status "Backend code uploaded successfully" -Status "SUCCESS"

# Step 2: Upload deployment script
Write-Status "Uploading deployment script..." -Status "INFO"
$deployScript = "$PSScriptRoot\deploy.sh"
if (Test-Path $deployScript) {
    scp -i $KeyPath $deployScript "ubuntu@${EC2Host}:/home/ubuntu/deploy.sh"
    Write-Status "Deployment script uploaded" -Status "SUCCESS"
}

# Step 3: Run deployment script
Write-Status "Running deployment script on EC2..." -Status "INFO"
ssh -i $KeyPath "ubuntu@${EC2Host}" @"
#!/bin/bash
set -e

echo "=================================================="
echo "Apex HR Portal - Backend Deployment"
echo "=================================================="

# Navigate to backend directory
cd /home/ubuntu/apex-backend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install --production

# Create symlink
sudo ln -sf /home/ubuntu/apex-backend /home/ubuntu/apex-hr-portal 2>/dev/null || true

# Create startup script
echo "Creating PM2 startup script..."
sudo mkdir -p /etc/systemd/system
cat > /tmp/apex-api.service << 'EOF'
[Unit]
Description=Apex HR Portal API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/apex-hr-portal
ExecStart=/usr/bin/env node server.js
Restart=always
RestartSec=10
Environment="NODE_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/apex-api.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload
sudo systemctl enable apex-api
sudo systemctl start apex-api

echo ""
echo "=================================================="
echo "Deployment Complete!"
echo "=================================================="
echo "Backend service starting..."
sudo systemctl status apex-api

echo ""
echo "To view logs:"
echo "  sudo journalctl -u apex-api -f"
"@

if ($LASTEXITCODE -eq 0) {
    Write-Status "Deployment completed successfully!" -Status "SUCCESS"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Verify backend is running:"
    Write-Host "   ssh -i $KeyPath ubuntu@${EC2Host} 'sudo systemctl status apex-api'"
    Write-Host ""
    Write-Host "2. Update DNS records:"
    Write-Host "   Point api.apexplacements.in to 13.207.1.159"
    Write-Host ""
    Write-Host "3. Configure SSL certificate (on EC2):"
    Write-Host "   sudo certbot certonly --standalone -d api.apexplacements.in"
    Write-Host ""
    Write-Host "4. Test the API:"
    Write-Host "   curl https://api.apexplacements.in/api/students"
} else {
    Write-Status "Deployment failed" -Status "ERROR"
    exit 1
}
