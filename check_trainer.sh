#!/bin/bash

# Check Trainer Account in Production

echo "Checking trainer account in production database..."
echo ""

# First, check if trainer exists
mysql -u root -p apex_placements -e "SELECT id, user_name, email, role, password, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';" 2>&1
