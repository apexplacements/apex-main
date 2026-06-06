#!/bin/bash
# Production Account Setup Script
# Usage: bash setup_production_accounts.sh

echo "=== Production Account Setup ==="
echo ""

# Configuration
PROD_SERVER="ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com"
PEM_FILE="C:\Users\santh\Website\apex-placements.pem"

echo "Step 1: Testing SSH connection..."
ssh -i "$PEM_FILE" "$PROD_SERVER" "echo '✓ SSH connection successful'"

echo ""
echo "Step 2: Creating trainer account in production..."

ssh -i "$PEM_FILE" "$PROD_SERVER" << 'EOF'
mysql -u root -p -e "
USE apex_placements;
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active', NOW())
ON DUPLICATE KEY UPDATE status = 'active';
"
EOF

echo ""
echo "Step 3: Verifying account creation..."

ssh -i "$PEM_FILE" "$PROD_SERVER" << 'EOF'
mysql -u root -p -e "
USE apex_placements;
SELECT email, role, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';
"
EOF

echo ""
echo "Step 4: Restarting backend service..."

ssh -i "$PEM_FILE" "$PROD_SERVER" << 'EOF'
pm2 restart apex-api || (cd /home/ubuntu/backend && npm start)
EOF

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Test credentials:"
echo "  Email: srikanth.tr@apexplacements.in"
echo "  Password: trainer@123"
echo ""
echo "Try login at: https://www.apexplacements.in"
