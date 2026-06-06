# Trainer Login Debug Guide

## Issue: 401 Unauthorized for srikanth.tr@apexplacements.in

### Root Cause
The trainer account `srikanth.tr@apexplacements.in` either:
1. Doesn't exist in the `generated_emails` table
2. Has an incorrect password stored
3. Has been created but with a different password

---

## Quick Fix (3 Steps)

### Step 1: Check Current Database State
Run this query to see if trainer accounts exist:

```sql
mysql -u root -p your_database

-- Check for trainer accounts
SELECT id, user_name, email, role, default_password, password 
FROM generated_emails 
WHERE role = 'tr' 
LIMIT 10;
```

**Expected Result**: Should show trainer accounts with `role = 'tr'`

**If Empty**: No trainer accounts exist - go to Step 2

---

### Step 2: Insert Trainer Accounts

```sql
-- Insert trainer account with default password
INSERT INTO generated_emails (user_name, role, email, default_password, password, status, created_at)
VALUES 
(
  'Srikanth Kumar (Trainer)',
  'tr',
  'srikanth.tr@apexplacements.in',
  'trainer@123',
  NULL,
  'active',
  NOW()
);

-- Verify it was inserted
SELECT id, user_name, email, role, default_password, password 
FROM generated_emails 
WHERE email = 'srikanth.tr@apexplacements.in';
```

**Output should show**:
```
id=X, user_name='Srikanth Kumar (Trainer)', email='srikanth.tr@apexplacements.in', role='tr', default_password='trainer@123', password=NULL
```

---

### Step 3: Test Login with Correct Credentials

In the frontend login form, use:
- **Email**: `srikanth.tr@apexplacements.in`
- **Password**: `trainer@123`

---

## Detailed Debug (If Issue Persists)

### Method 1: Use Backend Debug Endpoint

```bash
# When backend is running, query the debug endpoint
curl -s "http://localhost:5000/api/login/debug/registered?email=srikanth.tr@apexplacements.in"

# Expected response:
{
  "success": true,
  "email": "srikanth.tr@apexplacements.in",
  "registered": [],
  "generated": [
    {
      "id": X,
      "user_id": Y,
      "user_name": "Srikanth Kumar (Trainer)",
      "role": "tr",
      "email": "srikanth.tr@apexplacements.in",
      "default_password": "trainer@123",
      "password": null
    }
  ]
}
```

### Method 2: Run Debug Script

```bash
cd backend
node debug_trainer.js
```

This shows:
- ✅ If trainer account exists
- ✅ What passwords are stored
- ✅ How many trainer accounts exist

---

## Common Scenarios & Solutions

### Scenario 1: Account Not Found
```
Generated Emails Result:
  NOT FOUND - Need to insert trainer account
```

**Fix**: Run the INSERT query from Step 2 above

---

### Scenario 2: Password Mismatch
```
Stored Password: trainer@456
But trying to login with: trainer@123
```

**Fix**: Either:
- Option A: Update the stored password in DB
  ```sql
  UPDATE generated_emails 
  SET default_password = 'trainer@123' 
  WHERE email = 'srikanth.tr@apexplacements.in';
  ```

- Option B: Use the correct password from DB

---

### Scenario 3: Password Set (Not NULL)
```
default_password: 'trainer@123'
password: 'some_hashed_value'
```

**Fix**: The `password` field takes priority. Try:
- Using whatever password was set in the `password` field
- Or clear it: `UPDATE generated_emails SET password = NULL WHERE email = '...';`

---

## Password Priority Rules

The login endpoint checks passwords in this order:

```javascript
// In backend/routes/login.js
const correctPassword = entry.password || entry.default_password;

// This means:
// 1. If 'password' field is set → use it (takes priority)
// 2. If 'password' field is NULL → use 'default_password'
// 3. If both NULL → login fails
```

**Example**:
```
If password='xyz789' and default_password='trainer@123'
→ Login requires: xyz789 (password field wins)

If password=NULL and default_password='trainer@123'
→ Login requires: trainer@123 (default_password used)
```

---

## Complete Setup for All Users

### Admin Account
```sql
INSERT INTO generated_emails (user_name, role, email, default_password, status)
VALUES ('S Kumar', 'admin', 'skumar@apexplacements.in', 'admin@123', 'active');
```

### HR Account
```sql
INSERT INTO generated_emails (user_name, role, email, default_password, status)
VALUES ('Srikanth HR', 'hr', 'srikanth.hr@apexplacements.in', 'hr@123', 'active');
```

### Trainer Account (Your Issue)
```sql
INSERT INTO generated_emails (user_name, role, email, default_password, status)
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');
```

### Student Account
```sql
INSERT INTO generated_emails (user_name, role, email, default_password, status)
VALUES ('Student User', 'std', 'student@apexplacements.in', 'student@123', 'active');
```

### Verify All Accounts
```sql
SELECT email, role, default_password FROM generated_emails ORDER BY role;
```

---

## Login Test Checklist

After inserting trainer account:

- [ ] Trainer account exists in DB: `SELECT * FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in'`
- [ ] Backend is running: `curl http://localhost:5000/api/students`
- [ ] Frontend is running: `http://localhost:5173`
- [ ] Try login with email: `srikanth.tr@apexplacements.in`
- [ ] Try password: `trainer@123`
- [ ] Should redirect to `/trainer/dashboard`
- [ ] Should see "Trainer Dashboard" loaded
- [ ] Sidebar shows: Profile, My Batches, Manage Students, etc.

---

## Expected Behavior After Login

### Trainer Login Success
1. ✅ Frontend receives 200 response
2. ✅ User data saved to sessionStorage
3. ✅ Role = `tr` detected
4. ✅ Redirected to `/trainer/dashboard`
5. ✅ Trainer Dashboard displays with all tabs

### What You Should See
- Header: "Trainer Dashboard" with logout button
- Sidebar: 7 navigation items (Profile, Batches, Students, Attendance, Assignments, Announcements, Analytics)
- Main area: Current tab content

---

## Still Not Working?

### Enable Detailed Logging

Add to backend/routes/login.js:
```javascript
console.log('=== LOGIN DEBUG ===');
console.log('Email:', email);
console.log('Password provided:', password);
console.log('Entry from DB:', entry);
console.log('Correct password (entry.password || entry.default_password):', correctPassword);
console.log('Password match:', correctPassword === password);
```

### Check Backend Logs
```bash
cd backend
npm start

# You'll see detailed logging like:
# login route: received email=srikanth.tr@apexplacements.in
# login route: generated_emails count=1
# === LOGIN DEBUG ===
# ...
```

---

## Quick Commands Summary

```bash
# Check if trainer exists
mysql -u root -p db_name -e "SELECT email, role FROM generated_emails WHERE email='srikanth.tr@apexplacements.in';"

# Insert trainer if not exists
mysql -u root -p db_name < backend/insert_trainers.sql

# Run backend debug
cd backend && node debug_trainer.js

# Test with curl
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"srikanth.tr@apexplacements.in","password":"trainer@123"}'
```

---

## Need Help?

1. **Check logs**: Backend console shows exact reason for 401
2. **Use debug endpoint**: `/api/login/debug/registered?email=...`
3. **Run debug script**: `node debug_trainer.js`
4. **Check DB directly**: SQL queries above
5. **Review password rules**: Priority: password field > default_password field
