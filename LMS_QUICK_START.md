# LMS Quick Start Integration Guide

## 📌 IMMEDIATE NEXT STEPS (In Order)

### Step 1: Update App.jsx with LMS Routes (5 minutes)
```jsx
// src/App.jsx - Add these imports at the top
import StudentDashboard from "./student/StudentDashboard";
import TrainerDashboard from "./trainer/TrainerDashboard";

// Inside your Routes component, add:
<Route path="/student/dashboard" element={<StudentDashboard />} />
<Route path="/trainer/dashboard" element={<TrainerDashboard />} />
```

### Step 2: Update Navigation Component (5 minutes)
Add these links to your main navigation (LogInComp.jsx or Dashboard):
```jsx
{userData?.role === "std" && (
  <Link to="/student/dashboard">📚 Student Dashboard</Link>
)}
{userData?.role === "tr" && (
  <Link to="/trainer/dashboard">👨‍🏫 Trainer Dashboard</Link>
)}
```

### Step 3: Run Database Migration (10 minutes)
```bash
# Connect to your MySQL database
mysql -u root -p your_database < backend/migrations/001_create_lms_schema.sql

# Verify tables were created
mysql -u root -p your_database -e "SHOW TABLES;"
```

### Step 4: Insert Sample Data (5 minutes)
```sql
-- Courses
INSERT INTO courses (course_name, description, duration_hours, fee, difficulty_level)
VALUES 
('Linux Administration', 'Complete Linux fundamentals', 40, 5000, 'Beginner'),
('AWS Cloud', 'AWS certification prep', 50, 6000, 'Intermediate');

-- Trainer (assume user_id 7 exists in generated_emails)
INSERT INTO trainers (user_id, trainer_name, email, mobile, experience_years, specialization)
VALUES (7, 'Trainer Name', 'trainer@apex.com', '9876543210', 10, 'Linux & Cloud');

-- Batch
INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date, max_students, status)
VALUES (1, 1, 'Linux Batch June 2026', '2026-06-01', '2026-07-31', 30, 'Ongoing');

-- Enroll students (assume student IDs 1, 2, 3 exist)
INSERT INTO batch_students (batch_id, student_id, status)
VALUES (1, 1, 'Active'), (1, 2, 'Active'), (1, 3, 'Active');
```

### Step 5: Test Student Dashboard (5 minutes)
1. Login as a student (role = "std")
2. You should see "📚 Student Dashboard" link in navigation
3. Click to verify all tabs load (Courses, Assignments, Attendance, etc.)
4. Check browser console for any errors

### Step 6: Test Trainer Dashboard (5 minutes)
1. Login as a trainer (role = "tr")
2. You should see "👨‍🏫 Trainer Dashboard" link in navigation
3. Click to verify all tabs load (Batches, Students, Attendance, etc.)
4. Try creating a batch or marking attendance

## ⚡ Quick Verification Checklist

- [ ] App.jsx has StudentDashboard and TrainerDashboard routes
- [ ] Navigation updated with new dashboard links
- [ ] Database migration completed (14 tables created)
- [ ] Sample courses, trainer, batch, and students added
- [ ] Student can login and access dashboard
- [ ] Trainer can login and access dashboard
- [ ] All sidebar navigation items appear
- [ ] CSS styling looks good (no broken styles)
- [ ] Mobile responsive design works (test with F12)
- [ ] No console errors

## 🔗 File Locations

| File | Purpose | Location |
|------|---------|----------|
| StudentDashboard | Main student component | `frontend/apex-app/src/student/StudentDashboard.jsx` |
| StudentDashboard.css | Student styling | `frontend/apex-app/src/student/StudentDashboard.css` |
| TrainerDashboard | Main trainer component | `frontend/apex-app/src/trainer/TrainerDashboard.jsx` |
| TrainerDashboard.css | Trainer styling | `frontend/apex-app/src/trainer/TrainerDashboard.css` |
| Student sub-components | (10 files) | `frontend/apex-app/src/student/*.jsx` |
| Trainer sub-components | (7 files) | `frontend/apex-app/src/trainer/*.jsx` |
| Database schema | SQL migration | `backend/migrations/001_create_lms_schema.sql` |
| Trainer routes | Backend API | `backend/routes/trainerRoutes.js` |
| Student routes | Backend API | `backend/routes/studentRoutes.js` |

## 🚀 Build & Deploy

### Frontend Build
```bash
cd frontend/apex-app
npm run build
```

### Deploy to S3 + CloudFront
```bash
# Sync to S3
aws s3 sync dist s3://www.apexplacements.in --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id EJH7XW8Q93MKB --paths "/*"
```

### Backend Restart
```bash
# If running with PM2
pm2 restart apex-api

# Or if using npm
npm start
```

## 🆘 Troubleshooting

### Issue: Component not found
**Solution**: Check import paths in App.jsx are correct

### Issue: "Cannot read property of undefined"
**Solution**: Check sessionStorage.currentUser has correct role ("std" or "tr")

### Issue: API endpoints 404
**Solution**: 
1. Verify backend routes are imported in server.js
2. Check backend is running on correct port
3. Verify apiClient.js has correct base URL

### Issue: Styling looks broken
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Rebuild frontend (npm run build)
3. Check CSS file is imported in components

### Issue: Database connection error
**Solution**: 
1. Verify MySQL is running
2. Check database credentials in .env
3. Verify database name in connection string

## 📞 Support Resources

- See `LMS_README.md` for complete documentation
- See `LMS_IMPLEMENTATION_GUIDE.md` for detailed implementation
- Check component JSDoc comments for API details
- Review backend route files for endpoint documentation

## ✨ Features Summary

### Student Can:
- View enrolled courses
- Watch video lectures
- Submit assignments
- Check attendance
- Track learning progress
- Download certificates
- View announcements

### Trainer Can:
- Manage batches
- Add/remove students
- Mark attendance
- Review assignments
- Create announcements
- View analytics
- Track student progress

---

**Status**: Ready for integration and testing
**Completion Time**: ~30 minutes for setup
**Total Components Created**: 25+ React components
**Database Tables**: 14 tables with relationships
