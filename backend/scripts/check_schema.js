const db = require('../config/db');

async function check() {
  try {
    const [courses] = await db.query("SHOW COLUMNS FROM courses");
    console.log('courses:', courses);
    const [trainers] = await db.query("SHOW COLUMNS FROM trainers");
    console.log('trainers:', trainers);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

check();
