const db = require("./config/db");

(async () => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    console.log("DB connected, test query result:", rows[0]);

    const tables = [
      `CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(50),
        email VARCHAR(255),
        course VARCHAR(255),
        batch VARCHAR(255),
        status VARCHAR(100) DEFAULT 'Active',
        placement_company VARCHAR(255) DEFAULT NULL,
        placement_role VARCHAR(255) DEFAULT NULL,
        resume_url TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS placement_drives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(200),
        role_name VARCHAR(200),
        location VARCHAR(200),
        ctc VARCHAR(100),
        interview_date DATE,
        eligibility TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(200),
        role_name VARCHAR(200),
        experience VARCHAR(100),
        location VARCHAR(200),
        salary VARCHAR(100),
        description TEXT,
        apply_link TEXT,
        last_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(200),
        website VARCHAR(255),
        hr_name VARCHAR(200),
        hr_email VARCHAR(200),
        hr_mobile VARCHAR(20),
        location VARCHAR(200),
        logo_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS interviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        company_id INT,
        interview_date DATE,
        interview_time TIME,
        round_name VARCHAR(100),
        mode VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS placements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        company_name VARCHAR(200),
        role_name VARCHAR(200),
        package VARCHAR(100),
        placement_status VARCHAR(100) DEFAULT 'Placed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        message TEXT,
        notification_type VARCHAR(100),
        student_id INT,
        company_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS resumes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        resume_url TEXT,
        status VARCHAR(100) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        payment_type VARCHAR(100) NOT NULL,
        payer_name VARCHAR(255),
        payee_name VARCHAR(255),
        amount DECIMAL(12,2) NOT NULL,
        currency VARCHAR(20) DEFAULT 'INR',
        category VARCHAR(255),
        reference VARCHAR(255),
        status VARCHAR(100) DEFAULT 'Completed',
        payment_date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
    ];

    for (const sql of tables) {
      await db.query(sql);
    }

    console.log("HR tables created/verified successfully");
    process.exit(0);
  } catch (err) {
    console.error("DB test failed:", err);
    process.exit(1);
  }
})();
