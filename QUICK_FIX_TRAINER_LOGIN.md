# 🚀 QUICK FIX: Trainer Login 401 Error

## The Problem
```
POST http://localhost:5173/api/login 401 (Unauthorized)
Login attempt for: srikanth.tr@apexplacements.in
```

## The Solution (2 Minutes)

### Step 1: Open your MySQL client and run this ONE command:

```sql
INSERT INTO generated_emails (user_name, role, email, default_password, status) 
VALUES ('Srikanth Kumar (Trainer)', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');
```

**OR if using terminal:**
```bash
mysql -u root -p your_database -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES ('Srikanth Kumar (Trainer)', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');"
```

### Step 2: Verify it worked:

```sql
SELECT email, role, default_password FROM generated_emails WHERE email = 'srikanth.tr@apexplacements.in';
```

Should output:
```
srikanth.tr@apexplacements.in | tr | trainer@123
```

### Step 3: Try Login Again

- Email: `srikanth.tr@apexplacements.in`
- Password: `trainer@123`

✅ Should redirect to **Trainer Dashboard**

---

## Why This Happened

The trainer account wasn't created in the `generated_emails` table. The login endpoint checks this table for credentials.

---

## For All Demo Users

Use these accounts to test:

| Email | Role | Password |
|-------|------|----------|
| srikanth.tr@apexplacements.in | Trainer | trainer@123 |
| student@apexplacements.in | Student | student@123 |
| srikanth.hr@apexplacements.in | HR | Srikanth@12#* |
| skumar@apexplacements.in | Admin | admin@123 |

---

## If You Still Get 401

See: **TRAINER_LOGIN_DEBUG.md** for detailed troubleshooting

