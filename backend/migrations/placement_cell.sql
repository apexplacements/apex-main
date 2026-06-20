-- Placement Cell schema
CREATE TABLE IF NOT EXISTS companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255),
  hr_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  website VARCHAR(255),
  ctc VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placement_drives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  drive_name VARCHAR(255),
  company_id INT,
  role VARCHAR(255),
  package VARCHAR(100),
  location VARCHAR(255),
  eligibility TEXT,
  drive_date DATE,
  status VARCHAR(50) DEFAULT 'Open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS job_postings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_title VARCHAR(255),
  company_id INT,
  location VARCHAR(255),
  experience VARCHAR(100),
  package VARCHAR(100),
  apply_link VARCHAR(500),
  last_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  company_id INT,
  role VARCHAR(255),
  round VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Scheduled',
  remarks TEXT,
  interview_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  company_id INT,
  role VARCHAR(255),
  ctc VARCHAR(100),
  offer_date DATE,
  joining_date DATE,
  offer_letter_url TEXT,
  status VARCHAR(50) DEFAULT 'Offered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placed_students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  company_id INT,
  role VARCHAR(255),
  package VARCHAR(100),
  joining_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mock_interviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  trainer_id INT,
  date_time DATETIME,
  feedback TEXT,
  score INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resume_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  resume_url TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  remarks TEXT,
  verified_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS placement_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_type VARCHAR(50),
  report_date DATE,
  payload JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
