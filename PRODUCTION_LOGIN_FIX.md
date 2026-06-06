# 🔴 PRODUCTION LOGIN FIX - 401 Unauthorized

## Issue
```
POST https://api.apexplacements.in/api/login 401 (Unauthorized)
```

---

## ✅ Quick Test with Known Account

First, verify the backend is responding using a **known working account**:

### Test with HR Account (Known to Work)
- **Email**: `srikanth.hr@apexplacements.in`
- **Password**: `Srikanth@12#*`

If this works → Backend is fine. Your account just doesn't exist in production.

---

## 🔧 Add Your Account to Production

### Option 1: Via SSH to Production Server

```bash
# SSH into your production server
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# Connect to MySQL (on the server)
mysql -u your_db_user -p

# Enter your database password when prompted

# Run this INSERT for trainer account:
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active', NOW());

# Verify:
SELECT email, role, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';
```

### Option 2: Via Local MySQL to Production RDS

```bash
# If using AWS RDS
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p your_database

# Then run the INSERT query above
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active', NOW());
```

### Option 3: Create Script to Execute

Create file: `setup_production_users.sql`
```sql
-- Insert all demo users for production

-- Trainer Account (for LMS)
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active', NOW())
ON DUPLICATE KEY UPDATE status = 'active';

-- Student Account (for LMS)
INSERT INTO generated_emails (user_name, role, email, default_password, status, created_at) 
VALUES ('Demo Student', 'std', 'student@apexplacements.in', 'student@123', 'active', NOW())
ON DUPLICATE KEY UPDATE status = 'active';

-- Verify
SELECT email, role, default_password FROM generated_emails WHERE role IN ('tr', 'std');
```

Then execute:
```bash
# Via SSH
ssh ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
mysql -u root -p your_database < setup_production_users.sql
```

---

## 📋 Production Test Accounts

After setup, these should work on production:

| Email | Role | Password | Status |
|-------|------|----------|--------|
| srikanth.hr@apexplacements.in | HR | Srikanth@12#* | ✅ Already exists |
| srikanth.tr@apexplacements.in | Trainer | trainer@123 | ⚠️ Needs creation |
| student@apexplacements.in | Student | student@123 | ⚠️ Needs creation |
| skumar@apexplacements.in | Admin | admin@123 | Check if exists |

---

## ✅ Verify Production Setup

### Test 1: Check if account exists
```bash
curl "https://api.apexplacements.in/api/login/debug/registered?email=srikanth.tr@apexplacements.in"

# Should show:
{
  "generated": [
    {
      "email": "srikanth.tr@apexplacements.in",
      "role": "tr",
      "default_password": "trainer@123"
    }
  ]
}
```

### Test 2: Test login endpoint
```bash
curl -X POST https://api.apexplacements.in/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"srikanth.tr@apexplacements.in","password":"trainer@123"}'

# Should return:
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "id": X,
    "role": "tr",
    "email": "srikanth.tr@apexplacements.in"
  }
}
```

---

## 🚀 Production Deployment Checklist

- [ ] SSH access verified to EC2 instance
- [ ] MySQL credentials available
- [ ] Trainer account inserted
- [ ] Student account inserted
- [ ] Test login with trainer account on https://www.apexplacements.in
- [ ] Trainer Dashboard loads successfully
- [ ] Database migration (`001_create_lms_schema.sql`) executed

---

## 🔗 Production URLs

- **Frontend**: https://www.apexplacements.in
- **Backend API**: https://api.apexplacements.in/api
- **Debug Endpoint**: https://api.apexplacements.in/api/login/debug/registered?email=...

---

## ❌ Still Getting 401?

1. **Verify account exists**:
   ```bash
   curl "https://api.apexplacements.in/api/login/debug/registered?email=srikanth.tr@apexplacements.in"
   ```

2. **Check password is correct**:
   - Database shows `default_password = 'trainer@123'`
   - Frontend sending: `password = 'trainer@123'`

3. **Restart backend**:
   ```bash
   ssh ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
   # On server:
   cd /path/to/backend
   pm2 restart apex-api
   # or
   kill $(lsof -t -i:5000) && npm start
   ```

4. **Check logs**:
   ```bash
   ssh ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
   tail -100 /var/log/npm-apex.log
   ```

---

## 📞 Quick Commands Summary

```bash
# SSH to production
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# On server - connect to MySQL
mysql -u root -p

# Insert trainer account
INSERT INTO generated_emails (user_name, role, email, default_password, status) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');

# Verify
SELECT email, role, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';

# Exit MySQL
EXIT;

# Restart backend (if needed)
pm2 restart apex-api

# Check if running
pm2 list
```

---

## 🎯 Next Step

**Immediately execute**:
1. SSH to production server
2. Run the INSERT query above
3. Try login again with: `srikanth.tr@apexplacements.in` / `trainer@123`

Should see: **Trainer Dashboard** ✅
