const db = require('../config/db');

async function check() {
  try {
    const tables = ['batch_students','batches','courses','trainers','student_progress'];
    for (const t of tables){
      const [r] = await db.query("SHOW TABLES LIKE ?", [t]);
      console.log(t, r.length ? 'exists' : 'missing');
    }
    process.exit(0);
  } catch (err){
    console.error(err.message);
    process.exit(1);
  }
}

check();
