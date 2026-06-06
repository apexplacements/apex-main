# Apex LMS Implementation Guide

## Project Structure Overview

### Backend Structure
```
backend/
├── migrations/
│   └── 001_create_lms_schema.sql
├── routes/
│   ├── trainerRoutes.js
│   └── studentRoutes.js
├── config/
│   └── db.js (existing)
└── server.js (updated with LMS routes)
```

### Frontend Structure
```
frontend/apex-app/src/
├── student/
│   ├── StudentDashboard.jsx
│   ├── StudentDashboard.css
│   ├── MyCoursesComp.jsx
│   ├── CoursePlayerComp.jsx
│   ├── AssignmentsComp.jsx
│   ├── AttendanceComp.jsx
│   ├── ProgressComp.jsx
│   ├── CertificatesComp.jsx
│   ├── MockTestsComp.jsx
│   └── AnnouncementsComp.jsx
└── trainer/
    ├── TrainerDashboard.jsx
    ├── TrainerDashboard.css
    ├── MyBatchesComp.jsx
    ├── ManageStudentsComp.jsx
    ├── AssignmentReviewComp.jsx
    ├── AttendanceManagementComp.jsx
    ├── AnalyticsComp.jsx
    └── AnnouncementsComp.jsx
```

## Step 1: Database Setup

### Run the Migration
```bash
# Login to MySQL
mysql -u root -p your_database

# Run the migration
SOURCE /path/to/backend/migrations/001_create_lms_schema.sql;
```

### Key Tables Created
- `courses` - Course information
- `trainers` - Trainer profiles
- `batches` - Batch management (links courses with trainers)
- `batch_students` - Student enrollment in batches
- `course_modules` - Module structure
- `lessons` - Individual lessons
- `course_resources` - Downloadable resources
- `student_progress` - Track lesson completion
- `attendance` - Attendance records
- `assignments` - Assignment management
- `assignment_submissions` - Student submissions
- `mock_tests` - Test management
- `test_attempts` - Test results
- `certificates` - Certificate tracking
- `announcements` - Trainer announcements

## Step 2: Backend Integration

### Update App.jsx
Add routes for Student and Trainer Dashboards:
```jsx
import StudentDashboard from "./student/StudentDashboard";
import TrainerDashboard from "./trainer/TrainerDashboard";

// Add to router
<Route path="/student/dashboard" element={<StudentDashboard />} />
<Route path="/trainer/dashboard" element={<TrainerDashboard />} />
```

### Backend API Endpoints

#### Trainer API Endpoints (`/api/lms/trainer`)
```
GET    /profile/:trainerId              - Get trainer profile
PUT    /profile/:trainerId              - Update trainer profile
GET    /:trainerId/batches              - Get trainer's batches
POST   /:trainerId/batches              - Create batch
GET    /:trainerId/batches/:batchId/students  - Get batch students
POST   /:trainerId/batches/:batchId/students  - Add student to batch
POST   /:trainerId/batches/:batchId/attendance - Mark attendance
GET    /:trainerId/batches/:batchId/attendance-report - Attendance report
POST   /:trainerId/batches/:batchId/assignments - Create assignment
GET    /:trainerId/batches/:batchId/assignments - Get assignments
GET    /:trainerId/assignments/:assignmentId/submissions - Get submissions
PUT    /:trainerId/submissions/:submissionId/grade - Grade assignment
POST   /:trainerId/announcements        - Create announcement
GET    /:trainerId/batches/:batchId/announcements - Get announcements
GET    /:trainerId/batches/:batchId/analytics - Get batch analytics
```

#### Student API Endpoints (`/api/lms/student`)
```
GET    /:studentId/courses              - Get enrolled courses
GET    /:studentId/courses/:courseId/modules - Get course modules
GET    /:studentId/lessons/:lessonId    - Get lesson details
PUT    /:studentId/lessons/:lessonId/progress - Update progress
GET    /:studentId/courses/:courseId/resources - Get resources
GET    /:studentId/batches/:batchId/assignments - Get assignments
POST   /:studentId/assignments/:assignmentId/submit - Submit assignment
GET    /:studentId/batches/:batchId/attendance - Get attendance
GET    /:studentId/batches/:batchId/tests - Get mock tests
GET    /:studentId/tests/:testId/attempts - Get test results
GET    /:studentId/certificates        - Get certificates
GET    /:studentId/announcements        - Get announcements
GET    /:studentId/progress             - Get learning progress
```

## Step 3: Frontend Integration

### Update App.jsx with Routes
```jsx
import StudentDashboard from "./student/StudentDashboard";
import TrainerDashboard from "./trainer/TrainerDashboard";

<BrowserRouter>
  <Routes>
    {/* Existing routes */}
    <Route path="/student/dashboard" element={<StudentDashboard />} />
    <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
  </Routes>
</BrowserRouter>
```

### Update Navigation Component
Add navigation items for:
- Student Dashboard (visible when role = "std")
- Trainer Dashboard (visible when role = "tr")

```jsx
{userData?.role === "std" && (
  <Link to="/student/dashboard">Student Dashboard</Link>
)}
{userData?.role === "tr" && (
  <Link to="/trainer/dashboard">Trainer Dashboard</Link>
)}
```

## Step 4: Sample Data Setup

### Insert Sample Courses
```sql
INSERT INTO courses (course_name, description, duration_hours, fee, difficulty_level)
VALUES 
('Linux Administration', 'Complete Linux fundamentals', 40, 5000, 'Beginner'),
('AWS Cloud', 'AWS certification prep', 50, 6000, 'Intermediate'),
('DevOps', 'DevOps tools and practices', 45, 7000, 'Advanced');
```

### Insert Sample Trainer
```sql
INSERT INTO trainers (user_id, trainer_name, email, mobile, experience_years, specialization)
VALUES 
(1, 'Trainer Name', 'trainer@apex.com', '9876543210', 10, 'Linux & Cloud');
```

### Create Sample Batch
```sql
INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date, max_students)
VALUES 
(1, 1, 'Linux Batch 2026', '2026-06-01', '2026-07-31', 30);
```

## Step 5: Responsive Design Features

### Mobile Friendly
- Sidebar collapses on mobile (hamburger menu)
- Grid layouts respond to screen sizes
- Touch-friendly buttons and navigation
- Optimized table views for small screens

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

### CSS Features
- Flexbox and Grid layouts
- Media queries for responsiveness
- Smooth transitions and animations
- Accessible color contrast
- Touch-friendly spacing

## Step 6: Authentication & Authorization

### Check Role in Frontend
```jsx
useEffect(() => {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "std") {
    navigate("/login");
  }
}, [navigate]);
```

### Role Mapping
- `std` → Student Dashboard
- `tr` → Trainer Dashboard
- `admin` → Admin Dashboard (existing)
- `hr` → HR Dashboard (existing)
- `po` → Placement Officer Dashboard (existing)

## Step 7: Usage Examples

### For Students
1. Go to Student Dashboard after login (role = "std")
2. View enrolled courses in "My Courses"
3. Click "Continue Learning" to watch video lectures
4. Track progress with completion percentage
5. Submit assignments in the "Assignments" section
6. View attendance in "Attendance" tab
7. Download certificates after course completion

### For Trainers
1. Go to Trainer Dashboard after login (role = "tr")
2. Manage batches in "My Batches"
3. Add students to batches
4. Create and assign assignments
5. Mark attendance for students
6. Grade submissions and provide feedback
7. View analytics and student progress
8. Send announcements to batches

## API Response Format

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Action completed",
  "data": { /* Array or Object */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Testing Checklist

- [ ] Database migrations run successfully
- [ ] Backend API routes respond correctly
- [ ] Frontend dashboard loads without errors
- [ ] Mobile responsive design works
- [ ] Student can view courses
- [ ] Student can watch videos
- [ ] Student can submit assignments
- [ ] Trainer can create batches
- [ ] Trainer can manage students
- [ ] Trainer can grade assignments
- [ ] Attendance tracking works
- [ ] Progress calculation is accurate
- [ ] Certificates generate correctly
- [ ] Announcements display properly

## Performance Optimization

### Database Indexes
- Added indexes on frequently queried columns
- Foreign key relationships optimized
- Unique constraints prevent duplicates

### Frontend Optimization
- Lazy loading of components
- CSS modules for scoped styling
- Efficient state management
- API call optimization with error handling

## Security Considerations

- All routes require authentication
- Role-based access control enforced
- SQL injection prevention via parameterized queries
- CORS enabled for allowed origins
- SessionStorage for user data (client-side)

## Future Enhancements

- Live chat between trainers and students
- Gamification (badges, leaderboards)
- Advanced video player with bookmarks
- Real-time notifications
- Mobile app (React Native)
- Machine learning for personalized recommendations
- Video streaming optimization (HLS)
- Discussion forums
- Peer review system

## Troubleshooting

### Database Connection Error
```
Check: .env file has correct DB_HOST, DB_USER, DB_PASSWORD
```

### CORS Error
```
Check: Backend CORS origin includes frontend URL
```

### Route Not Found
```
Check: New routes are imported in server.js
```

### Component Not Rendering
```
Check: Component path is correct
Check: SessionStorage has currentUser data
```

---

## Support & Documentation

For detailed API documentation, see individual route files:
- `backend/routes/trainerRoutes.js`
- `backend/routes/studentRoutes.js`

For component props and usage:
- Check JSDoc comments in React components
- Review component files in `frontend/apex-app/src/student/`
- Review component files in `frontend/apex-app/src/trainer/`
