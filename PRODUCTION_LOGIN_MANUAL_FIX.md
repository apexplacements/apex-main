# 🔧 Manual Fix: Production Login 401 Error

## What's Happening
You're getting 401 Unauthorized at `https://api.apexplacements.in/api/login`. This means:
1. The account doesn't exist in the production database, OR
2. The password is incorrect

---

## ✅ Manual Fix (5 Steps)

### Step 1: SSH to Your Production Server

```powershell
# In PowerShell
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
```

You should see a Ubuntu terminal prompt: `ubuntu@ip-xxx:~$`

---

### Step 2: Connect to MySQL

```bash
# On the remote server
mysql -u root -p
```

When prompted, enter your MySQL root password.

You should see: `mysql>`

---

### Step 3: Insert Trainer Account

```sql
-- Copy and paste this entire block:

USE apex_placements;

INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active', NOW());

-- Verify it worked:
SELECT email, role, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';
```

**Expected output**:
```
| email                             | role | default_password |
| srikanth.tr@apexplacements.in    | tr   | trainer@123      |
```

---

### Step 4: Exit MySQL & Restart Backend

```bash
# Exit MySQL
EXIT;

# Restart the backend service
pm2 restart apex-api

# If PM2 not installed, use:
# killall node
# cd ~/backend && npm start &
```

---

### Step 5: Test Login

Try logging in to https://www.apexplacements.in with:
- **Email**: `srikanth.tr@apexplacements.in`
- **Password**: `trainer@123`

✅ Should redirect to **Trainer Dashboard**

---

## 🚨 If Still Not Working

### Debug Check 1: Verify Account Exists

```bash
# SSH back in
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# Check if account exists
mysql -u root -p -e "USE apex_placements; SELECT email, role FROM generated_emails WHERE role = 'tr';"
```

Should show at least one trainer account.

---

### Debug Check 2: Verify Backend is Running

```bash
# On remote server
curl http://localhost:5000/api/students

# Should return JSON (not "connection refused")
```

If connection refused → restart: `pm2 restart apex-api`

---

### Debug Check 3: Check Backend Logs

```bash
# On remote server
pm2 logs apex-api

# Look for errors
```

---

## 🎯 Automated Alternative

### Use the PowerShell Script (Automatic)

```powershell
# On your local Windows PowerShell
cd C:\Users\santh\Website\APEXSKILLS
.\Fix-ProductionLogin.ps1
```

This script will automatically:
1. ✓ SSH to production
2. ✓ Insert trainer account
3. ✓ Verify account
4. ✓ Test login endpoint
5. ✓ Display results

---

## 📋 All Production Test Accounts

After setup, these accounts should work:

```
Email: srikanth.tr@apexplacements.in
Password: trainer@123
Role: Trainer (tr)
Dashboard: https://www.apexplacements.in → Trainer Dashboard

Email: srikanth.hr@apexplacements.in
Password: Srikanth@12#*
Role: HR
Dashboard: https://www.apexplacements.in → HR Dashboard

Email: student@apexplacements.in
Password: student@123
Role: Student (std)
Dashboard: https://www.apexplacements.in → Student Dashboard
```

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| SSH connection refused | Check PEM file path and permissions |
| MySQL command not found | Ensure MySQL client is installed on server |
| Permission denied for MySQL | Check MySQL root password |
| Account already exists error | Use `ON DUPLICATE KEY UPDATE` in the INSERT (already in the script) |
| Backend still returns 401 | Restart PM2: `pm2 restart apex-api` |
| PM2 command not found | Use `npm start` in backend directory instead |

---

## 🚀 Full Production Setup (From Scratch)

If you need to set up everything:

```bash
# SSH to server
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# Run database migration for LMS (if not done)
mysql -u root -p apex_placements < /path/to/backend/migrations/001_create_lms_schema.sql

# Insert all test accounts
mysql -u root -p apex_placements << 'EOF'
INSERT INTO generated_emails (user_name, role, email, default_password, status) 
VALUES 
('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active'),
('Demo Student', 'std', 'student@apexplacements.in', 'student@123', 'active');
EOF

# Restart backend
pm2 restart apex-api

# Verify
curl -s https://api.apexplacements.in/api/login/debug/registered?email=srikanth.tr@apexplacements.in
```

---

## 📞 Need Help?

1. Check **PRODUCTION_LOGIN_FIX.md** for more details
2. Run **Fix-ProductionLogin.ps1** for automated setup
3. Check backend logs: `pm2 logs apex-api`
4. Verify frontend is loading: `https://www.apexplacements.in`
5. Test API directly: `curl https://api.apexplacements.in/api/students`
