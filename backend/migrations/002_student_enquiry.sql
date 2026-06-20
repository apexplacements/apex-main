-- Migration: create student_enquiry table and migrate data from user_requests
-- 1) Create `student_enquiry` if it doesn't exist
CREATE TABLE IF NOT EXISTS student_enquiry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  career_option VARCHAR(255),
  job_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) If `user_requests` exists, copy rows that are not already present (preserve ids)
INSERT INTO student_enquiry (id, full_name, phone, email, career_option, job_type, created_at)
SELECT ur.id, ur.full_name, ur.phone, ur.email, ur.career_option, ur.job_type, ur.created_at
FROM user_requests ur
LEFT JOIN student_enquiry se ON se.id = ur.id
WHERE se.id IS NULL;

-- 3) (Optional) Once verified, you can drop the old table:
-- DROP TABLE IF EXISTS user_requests;

-- 4) Add an index on job_type if queries will filter by it often
CREATE INDEX IF NOT EXISTS idx_student_enquiry_job_type ON student_enquiry (job_type);
