# Production Post-Deployment Setup Guide

This guide contains the next steps to fully enable LMS functionality and create test accounts.

---

## Step 1: Create Trainer Account (2 minutes)

### Via SSH + MySQL

```bash
# 1. SSH to EC2
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# 2. Connect to MySQL
mysql -u root -p apex_placements

# 3. Run this SQL command (then Enter password when prompted)
INSERT INTO generated_emails (user_name, role, email, default_password, status) 
VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');

# 4. Verify it was created
SELECT * FROM generated_emails WHERE role = 'tr';

# 5. Exit MySQL
exit

# 6. Exit SSH
exit
```

### Result
✅ Trainer account created and ready to login

**Login Credentials:**
- Email: srikanth.tr@apexplacements.in
- Password: trainer@123

---

## Step 2: Create Student Account (2 minutes)

### Via SSH + MySQL

```bash
# 1. SSH to EC2
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# 2. Connect to MySQL
mysql -u root -p apex_placements

# 3. Run this SQL command
INSERT INTO generated_emails (user_name, role, email, default_password, status) 
VALUES ('Demo Student', 'std', 'student@apexplacements.in', 'student@123', 'active');

# 4. Verify
SELECT * FROM generated_emails WHERE role = 'std';

# 5. Exit
exit
exit
```

### Result
✅ Student account created and ready to login

**Login Credentials:**
- Email: student@apexplacements.in
- Password: student@123

---

## Step 3: Run LMS Database Migration (5 minutes)

### Via SSH + MySQL

This creates all 14 LMS tables needed for full functionality.

```bash
# 1. SSH to EC2
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# 2. Run migration (assuming file path)
mysql -u root -p apex_placements < /path/to/backend/migrations/001_create_lms_schema.sql

# 3. Verify tables were created
mysql -u root -p apex_placements -e "SHOW TABLES;"

# 4. You should see these tables:
# - courses
# - trainers
# - batches
# - batch_students
# - course_modules
# - lessons
# - course_resources
# - student_progress
# - attendance
# - assignments
# - assignment_submissions
# - mock_tests
# - test_attempts
# - certificates
# - announcements
```

### Result
✅ 14 LMS tables created with proper relationships

---

## Step 4: Browser Testing (10 minutes)

### Test HR Account (Should Already Work)
1. Open: https://www.apexplacements.in
2. Login: srikanth.hr@apexplacements.in / Srikanth@12#*
3. Expected: HR Dashboard appears
4. Click: "LMS" or navigate to `/lms/student`
5. Expected: Student Dashboard loads

### Test Trainer Account (Just Created)
1. Open: https://www.apexplacements.in
2. Login: srikanth.tr@apexplacements.in / trainer@123
3. Expected: Trainer Dashboard appears
4. Features available:
   - Profile Management
   - Batch Management
   - Student Management
   - Mark Attendance
   - Grade Assignments
   - Announcements
   - Analytics

### Test Student Account (Just Created)
1. Open: https://www.apexplacements.in
2. Login: student@apexplacements.in / student@123
3. Expected: Student Dashboard appears
4. Features available:
   - My Courses
   - Course Player
   - Assignments
   - Attendance
   - Mock Tests
   - Progress
   - Certificates
   - Announcements

---

## Quick Command Reference

### Copy/Paste Commands for Terminal

**SSH to EC2:**
```
ssh -i "C:\Users\santh\Website\apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com
```

**Create All Accounts + Run Migration (One Script):**
```bash
# Save as: setup_production.sh
#!/bin/bash

echo "Creating trainer account..."
mysql -u root -p apex_placements -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES ('Srikanth Trainer', 'tr', 'srikanth.tr@apexplacements.in', 'trainer@123', 'active');"

echo "Creating student account..."
mysql -u root -p apex_placements -e "INSERT INTO generated_emails (user_name, role, email, default_password, status) VALUES ('Demo Student', 'std', 'student@apexplacements.in', 'student@123', 'active');"

echo "Running LMS migration..."
mysql -u root -p apex_placements < backend/migrations/001_create_lms_schema.sql

echo "Verifying setup..."
mysql -u root -p apex_placements -e "SELECT COUNT(*) as accounts FROM generated_emails; SHOW TABLES;"

echo "Setup complete!"
```

---

## Verification Checklist

After completing all steps:

- [ ] Trainer account created (can login)
- [ ] Student account created (can login)
- [ ] LMS database tables created (14 tables)
- [ ] HR Dashboard displays LMS options
- [ ] Trainer Dashboard shows all 8 tabs
- [ ] Student Dashboard shows all 10 tabs
- [ ] Can navigate between dashboards
- [ ] All API endpoints responding

---

## Troubleshooting

### "Access Denied" when logging in
- Verify account was inserted: `SELECT * FROM generated_emails WHERE email='...';`
- Check password spelling (case-sensitive)
- Verify role is correct: 'hr', 'tr', 'std', 'admin', 'po'

### "Table doesn't exist" errors in dashboard
- Run LMS migration: `mysql -u root -p apex_placements < backend/migrations/001_create_lms_schema.sql`
- Verify tables: `SHOW TABLES;`

### Dashboard not loading
- Check browser console (F12 → Console tab)
- Verify API is responding: https://api.apexplacements.in/api/students
- Clear browser cache (Ctrl+Shift+Delete)

### API endpoints returning 404
- Verify routes are registered in backend
- Check backend is running: `pm2 status` on EC2
- Restart backend if needed: `pm2 restart apex-api`

---

## Performance Notes

### First Load Times
- **Initial**: 5-10 seconds (CloudFront cache warming)
- **Cached**: < 1 second (from CloudFront)
- **API Response**: 200-500ms

### Optimization
- CloudFront will auto-cache after 1-2 minutes
- Subsequent loads will be faster
- Dashboard components lazy-load for better performance

---

## Production Monitoring

### Check Application Status
```bash
# SSH to EC2
ssh -i "apex-placements.pem" ubuntu@ec2-13-207-1-159.ap-south-1.compute.amazonaws.com

# View logs
pm2 logs apex-api

# Check status
pm2 status

# View memory usage
pm2 monit
```

### Check Database
```bash
mysql -u root -p apex_placements -e "SELECT COUNT(*) as user_count FROM generated_emails;"
```

---

## Summary

After completing these steps:

✅ **3 Test Accounts Created**: HR (pre-existing), Trainer, Student  
✅ **14 LMS Tables**: Ready for data operations  
✅ **All Dashboards**: Fully functional  
✅ **28 API Endpoints**: Ready for use  
✅ **Production Live**: Ready for real users  

---

## Next: Browser Testing

1. Open https://www.apexplacements.in
2. Test each role:
   - HR: srikanth.hr@apexplacements.in / Srikanth@12#*
   - Trainer: srikanth.tr@apexplacements.in / trainer@123
   - Student: student@apexplacements.in / student@123
3. Verify all dashboard components load
4. Test navigation between sections
5. Verify API calls work (check browser Network tab)

---

## Support Files

- **PRODUCTION_TEST_REPORT.md** - Detailed test results
- **PRODUCTION_DEPLOYMENT_CHECKLIST.md** - Full checklist
- **DEPLOY_NOW.md** - Quick reference
- **LMS_QUICK_START.md** - LMS feature overview

---

**Total Time to Complete**: ~20 minutes  
**Status**: Ready for production testing  
**Next Action**: Run setup commands above
