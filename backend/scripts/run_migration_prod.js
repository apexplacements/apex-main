const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  try {
    const sqlPath = '/home/ubuntu/001_create_lms_schema.sql';
    const sql = fs.readFileSync(sqlPath, 'utf8');
    const statements = sql.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean);
    for (const stmt of statements) {
      try {
        await db.query(stmt);
        console.log('OK:', stmt.split('\n')[0].slice(0,120));
      } catch (err) {
        console.error('ERROR executing statement:', err.sqlMessage || err.message);
      }
    }
    console.log('Migration run completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration runner failed:', err.message);
    process.exit(1);
  }
}

run();
