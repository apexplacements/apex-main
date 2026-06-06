# Apex Skills Learning Management System (LMS)

## Overview

This is a comprehensive Learning Management System built for **Apex Skills & Placement Center** using React, Node.js, Express, and MySQL. It provides complete functionality for students to learn through courses and for trainers to manage batches, track progress, and grade assignments.

## Features

### 📚 Student Dashboard
- **My Courses** - View enrolled courses with progress tracking
- **Course Player** - Watch video lectures organized by modules
- **Assignments** - Submit and track assignment submissions
- **Attendance** - View attendance records and percentage
- **Mock Tests** - Take practice tests and view results
- **Progress** - Track learning progress for each course
- **Certificates** - Download earned certificates
- **Announcements** - Receive important announcements from trainers

### 👨‍🏫 Trainer Dashboard
- **Trainer Profile** - Manage trainer information and qualifications
- **My Batches** - Create and manage course batches
- **Manage Students** - Add/remove students from batches
- **Attendance** - Mark attendance and generate reports
- **Assignments** - Create assignments and manage submissions
- **Grade Submissions** - Review and grade student work
- **Analytics** - View student progress and performance metrics
- **Announcements** - Send announcements to students

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, React Router, Axios, CSS3 |
| **Backend** | Node.js, Express, Body-Parser |
| **Database** | MySQL with RDS (AWS) |
| **Storage** | AWS S3 |
| **Hosting** | AWS EC2 (Backend), CloudFront (Frontend) |
| **Authentication** | JWT with SessionStorage |

## Installation & Setup

### Prerequisites
- Node.js v14+ and npm
- MySQL Server or AWS RDS
- AWS CLI configured (optional, for S3 access)
- Git

### Step 1: Database Setup

```bash
# Connect to your MySQL database
mysql -u root -p

# Run the migration
SOURCE /path/to/backend/migrations/001_create_lms_schema.sql;

# Verify tables created
SHOW TABLES;
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already done)
npm install

# Create/Update .env file
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=5000" > .env

# Start the backend server
npm start
# or use PM2
pm2 start server.js --name apex-api
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/apex-app

# Install dependencies (if not already done)
npm install

# Update apiClient.js with your backend URL
# Replace VITE_API_URL with your backend URL

# Build for production
npm run build

# Start development server (for testing)
npm run dev
```

### Step 4: Add Routes to App.jsx

```jsx
// src/App.jsx
import StudentDashboard from "./student/StudentDashboard";
import TrainerDashboard from "./trainer/TrainerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        
        {/* New LMS Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 5: Update Navigation

In your main navigation component, add:
```jsx
{userData?.role === "std" && (
  <Link to="/student/dashboard">Student Dashboard</Link>
)}
{userData?.role === "tr" && (
  <Link to="/trainer/dashboard">Trainer Dashboard</Link>
)}
```

## Directory Structure

```
APEXSKILLS/
├── backend/
│   ├── migrations/
│   │   └── 001_create_lms_schema.sql
│   ├── routes/
│   │   ├── trainerRoutes.js
│   │   ├── studentRoutes.js
│   │   └── ... (existing routes)
│   ├── config/
│   │   └── db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   └── apex-app/
│       └── src/
│           ├── student/
│           │   ├── StudentDashboard.jsx
│           │   ├── StudentDashboard.css
│           │   ├── MyCoursesComp.jsx
│           │   ├── CoursePlayerComp.jsx
│           │   ├── AssignmentsComp.jsx
│           │   ├── AttendanceComp.jsx
│           │   ├── ProgressComp.jsx
│           │   ├── CertificatesComp.jsx
│           │   ├── MockTestsComp.jsx
│           │   └── AnnouncementsComp.jsx
│           └── ...
└── LMS_IMPLEMENTATION_GUIDE.md
```

## API Endpoints

### Trainer Endpoints (`/api/lms/trainer`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/profile/:trainerId` | Get trainer profile |
| PUT | `/profile/:trainerId` | Update trainer info |
| GET | `/:trainerId/batches` | Get all trainer's batches |
| POST | `/:trainerId/batches` | Create new batch |
| GET | `/:trainerId/batches/:batchId/students` | Get batch students |
| POST | `/:trainerId/batches/:batchId/students` | Add student to batch |
| POST | `/:trainerId/batches/:batchId/attendance` | Mark attendance |
| GET | `/:trainerId/batches/:batchId/attendance-report` | Get attendance report |
| POST | `/:trainerId/batches/:batchId/assignments` | Create assignment |
| GET | `/:trainerId/batches/:batchId/assignments` | Get batch assignments |
| GET | `/:trainerId/assignments/:assignmentId/submissions` | Get submissions |
| PUT | `/:trainerId/submissions/:submissionId/grade` | Grade submission |
| POST | `/:trainerId/announcements` | Create announcement |
| GET | `/:trainerId/batches/:batchId/announcements` | Get batch announcements |
| GET | `/:trainerId/batches/:batchId/analytics` | Get analytics |

### Student Endpoints (`/api/lms/student`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/:studentId/courses` | Get enrolled courses |
| GET | `/:studentId/courses/:courseId/modules` | Get course modules |
| GET | `/:studentId/lessons/:lessonId` | Get lesson details |
| PUT | `/:studentId/lessons/:lessonId/progress` | Update lesson progress |
| GET | `/:studentId/courses/:courseId/resources` | Get resources |
| GET | `/:studentId/batches/:batchId/assignments` | Get assignments |
| POST | `/:studentId/assignments/:assignmentId/submit` | Submit assignment |
| GET | `/:studentId/batches/:batchId/attendance` | Get attendance |
| GET | `/:studentId/batches/:batchId/tests` | Get mock tests |
| GET | `/:studentId/tests/:testId/attempts` | Get test results |
| GET | `/:studentId/certificates` | Get certificates |
| GET | `/:studentId/announcements` | Get announcements |
| GET | `/:studentId/progress` | Get learning progress |

## Sample Data Setup

### Add Sample Courses
```sql
INSERT INTO courses (course_name, description, duration_hours, fee, difficulty_level)
VALUES 
('Linux Administration', 'Complete Linux fundamentals', 40, 5000, 'Beginner'),
('AWS Cloud', 'AWS certification prep', 50, 6000, 'Intermediate'),
('DevOps Tools', 'DevOps tools and practices', 45, 7000, 'Advanced'),
('Python Programming', 'Learn Python from scratch', 35, 4000, 'Beginner');
```

### Add Sample Trainer
```sql
INSERT INTO trainers (user_id, trainer_name, email, mobile, experience_years, specialization)
VALUES 
(7, 'Srikanth Kumar', 'srikanth.tr@apexplacements.in', '9876543210', 10, 'Linux & Cloud');
```

### Create Sample Batch
```sql
INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date, max_students, status)
VALUES 
(1, 1, 'Linux Batch June 2026', '2026-06-01', '2026-07-31', 30, 'Ongoing');
```

### Enroll Students
```sql
INSERT INTO batch_students (batch_id, student_id, status)
VALUES 
(1, 1, 'Active'),
(1, 2, 'Active'),
(1, 3, 'Active');
```

## Database Schema Highlights

### Key Tables

**courses** - Course information
```sql
- id (PK)
- course_name (UNIQUE)
- description, duration_hours, fee
- difficulty_level (Beginner/Intermediate/Advanced)
```

**batches** - Batch management
```sql
- id (PK)
- course_id (FK)
- trainer_id (FK)
- start_date, end_date
- status (Scheduled/Ongoing/Completed/Cancelled)
```

**student_progress** - Track completion
```sql
- student_id (FK)
- lesson_id (FK)
- is_completed, watch_duration_minutes
- completed_at timestamp
```

**attendance** - Attendance tracking
```sql
- batch_id (FK)
- student_id (FK)
- attendance_date
- status (Present/Absent/Leave/Late)
```

## Responsive Design

### Mobile-First Approach
- Hamburger menu for navigation on mobile
- Responsive grid layouts
- Touch-friendly buttons and spacing
- Optimized table views

### Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px  
- **Mobile**: Below 768px

## Authentication & Authorization

### Role-Based Access
- `std` (Student) → Student Dashboard
- `tr` (Trainer) → Trainer Dashboard
- `admin` → Admin Dashboard
- `hr` → HR Dashboard
- `po` → Placement Officer Dashboard

### Session Management
```jsx
// Get user data from sessionStorage
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

// Verify role before showing dashboard
if (!currentUser || currentUser.role !== "std") {
  navigate("/login");
}
```

## Performance Considerations

### Database Optimization
- Indexed foreign keys
- Indexed frequently queried columns
- Efficient JOIN queries
- Connection pooling via db.js

### Frontend Optimization
- Lazy loading of components
- CSS modules for scoped styling
- Efficient API calls with caching
- Pagination for large datasets

### Backend Optimization
- Request validation
- Error handling
- Database query optimization
- Response compression

## Security Best Practices

- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled for allowed origins
- ✅ HTTPS enforced in production
- ✅ Sensitive data not logged

## Deployment

### Frontend Deployment (AWS S3 + CloudFront)
```bash
# Build for production
npm run build

# Sync to S3
aws s3 sync dist s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Backend Deployment (AWS EC2)
```bash
# Using PM2
pm2 start server.js --name apex-api
pm2 save
pm2 startup
```

## Troubleshooting

### Issue: Database Connection Failed
```
Solution: Check .env file for correct DB credentials
Check MySQL server is running
Verify network access to RDS
```

### Issue: CORS Error
```
Solution: Update CORS_ORIGIN in .env to include frontend URL
Restart backend server
```

### Issue: Components Not Loading
```
Solution: Clear browser cache (Ctrl+Shift+Delete)
Check browser console for errors
Verify component imports are correct
```

## Next Steps

1. ✅ Set up database schema
2. ✅ Verify backend routes
3. ✅ Update frontend routes in App.jsx
4. ✅ Insert sample data
5. ✅ Test student login and dashboard
6. ✅ Test trainer login and dashboard
7. ✅ Deploy to production
8. 📋 Create trainer accounts
9. 📋 Enroll students in batches
10. 📋 Upload course content

## Support & Contact

For questions or issues:
- Check the detailed `LMS_IMPLEMENTATION_GUIDE.md`
- Review component JSDoc comments
- Check backend route documentation
- Contact your technical team

## License

© 2026 Apex Skills & Placement Center. All rights reserved.

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready
