-- ============================================
-- APEX SKILLS LMS SCHEMA
-- Complete Learning Management System Tables
-- ============================================

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  duration_hours INT,
  fee DECIMAL(10, 2) DEFAULT 0,
  difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_course_name (course_name)
);

-- ============================================
-- TRAINERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  trainer_name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  experience_years INT,
  specialization VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  certification TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  INDEX idx_trainer_name (trainer_name),
  INDEX idx_is_active (is_active)
);

-- ============================================
-- BATCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS batches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  trainer_id INT NOT NULL,
  batch_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_students INT DEFAULT 30,
  status ENUM('Scheduled', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE RESTRICT,
  INDEX idx_course_id (course_id),
  INDEX idx_trainer_id (trainer_id),
  INDEX idx_status (status)
);

-- ============================================
-- BATCH STUDENTS (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS batch_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT NOT NULL,
  student_id INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_date DATE,
  status ENUM('Active', 'Completed', 'Dropped', 'On_Hold') DEFAULT 'Active',
  INDEX idx_batch_id (batch_id),
  INDEX idx_student_id (student_id),
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  UNIQUE KEY unique_batch_student (batch_id, student_id)
);

-- ============================================
-- COURSE MODULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS course_modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  module_number INT NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course_id (course_id),
  INDEX idx_module_number (module_number)
);

-- ============================================
-- LESSONS/VIDEOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module_id INT NOT NULL,
  lesson_number INT NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  description TEXT,
  video_url TEXT,
  video_duration_minutes INT,
  sequence_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE,
  INDEX idx_module_id (module_id),
  INDEX idx_sequence_order (sequence_order)
);

-- ============================================
-- COURSE RESOURCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS course_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  module_id INT,
  resource_title VARCHAR(255) NOT NULL,
  resource_type ENUM('PDF', 'Notes', 'Assignment', 'Lab_Manual', 'Interview_Questions', 'Document') DEFAULT 'Document',
  file_url TEXT NOT NULL,
  file_size_kb INT,
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_course_id (course_id),
  INDEX idx_resource_type (resource_type)
);

-- ============================================
-- STUDENT PROGRESS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS student_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  batch_id INT NOT NULL,
  lesson_id INT,
  module_id INT,
  is_completed BOOLEAN DEFAULT FALSE,
  watch_duration_minutes INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  last_accessed_at TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
  FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE SET NULL,
  INDEX idx_student_id (student_id),
  INDEX idx_batch_id (batch_id),
  INDEX idx_lesson_id (lesson_id),
  UNIQUE KEY unique_student_lesson_batch (student_id, lesson_id, batch_id)
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT NOT NULL,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Leave', 'Late') DEFAULT 'Absent',
  remarks TEXT,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  INDEX idx_batch_id (batch_id),
  INDEX idx_student_id (student_id),
  INDEX idx_date (attendance_date),
  UNIQUE KEY unique_attendance (batch_id, student_id, attendance_date)
);

-- ============================================
-- ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT NOT NULL,
  course_id INT NOT NULL,
  assignment_title VARCHAR(255) NOT NULL,
  description TEXT,
  assignment_file_url TEXT,
  due_date DATE NOT NULL,
  total_marks INT DEFAULT 100,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_batch_id (batch_id),
  INDEX idx_due_date (due_date)
);

-- ============================================
-- ASSIGNMENT SUBMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  submitted_file_url TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  marks_obtained INT,
  feedback TEXT,
  status ENUM('Pending', 'Submitted', 'Graded', 'Late') DEFAULT 'Pending',
  graded_by INT,
  graded_at TIMESTAMP NULL,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  FOREIGN KEY (graded_by) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_assignment_id (assignment_id),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status),
  UNIQUE KEY unique_submission (assignment_id, student_id)
);

-- ============================================
-- MOCK TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mock_tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT NOT NULL,
  course_id INT NOT NULL,
  test_name VARCHAR(255) NOT NULL,
  test_description TEXT,
  total_questions INT,
  total_marks INT DEFAULT 100,
  duration_minutes INT,
  pass_percentage INT DEFAULT 40,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_batch_id (batch_id)
);

-- ============================================
-- TEST ATTEMPTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS test_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  student_id INT NOT NULL,
  marks_obtained INT,
  total_marks INT,
  status ENUM('Pass', 'Fail', 'In_Progress') DEFAULT 'In_Progress',
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (test_id) REFERENCES mock_tests(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  INDEX idx_test_id (test_id),
  INDEX idx_student_id (student_id)
);

-- ============================================
-- CERTIFICATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  batch_id INT NOT NULL,
  course_id INT NOT NULL,
  certificate_number VARCHAR(100) UNIQUE,
  issued_date DATE NOT NULL,
  completion_percentage INT,
  certificate_file_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES generated_emails(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE RESTRICT,
  INDEX idx_student_id (student_id),
  INDEX idx_batch_id (batch_id)
);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  batch_id INT,
  course_id INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type ENUM('General', 'Holiday', 'Assignment', 'Exam', 'Interview', 'Important') DEFAULT 'General',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valid_until DATE,
  FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES trainers(id) ON DELETE SET NULL,
  INDEX idx_batch_id (batch_id),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- Create Indexes for Performance
-- ============================================
CREATE INDEX idx_batch_students_batch ON batch_students(batch_id);
CREATE INDEX idx_batch_students_student ON batch_students(student_id);
CREATE INDEX idx_student_progress_batch ON student_progress(batch_id);
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_attendance_batch ON attendance(batch_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
