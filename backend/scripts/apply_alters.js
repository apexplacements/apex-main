const db = require('../config/db');

const statements = [
  `ALTER TABLE courses
     ADD COLUMN IF NOT EXISTS duration_hours INT AFTER course_name,
     ADD COLUMN IF NOT EXISTS difficulty_level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner' AFTER fee,
     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at` ,
  `ALTER TABLE trainers
     ADD COLUMN IF NOT EXISTS user_id INT,
     ADD COLUMN IF NOT EXISTS email VARCHAR(255),
     ADD COLUMN IF NOT EXISTS experience_years INT,
     ADD COLUMN IF NOT EXISTS specialization VARCHAR(255),
     ADD COLUMN IF NOT EXISTS bio TEXT,
     ADD COLUMN IF NOT EXISTS certification TEXT,
     ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP`,
];

async function run(){
  for (const s of statements){
    try{
      await db.query(s);
      console.log('OK ALTER');
    }catch(err){
      console.error('ALTER ERROR:', err.sqlMessage || err.message);
    }
  }
  process.exit(0);
}

run();
