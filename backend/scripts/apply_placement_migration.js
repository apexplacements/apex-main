const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  try {
    const sqlPath = path.join(__dirname, '..', 'migrations', 'placement_cell.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // split on semicolon followed by newline (simple splitter)
    const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);

    for (const stmt of statements) {
      try {
        await db.query(stmt);
      } catch (e) {
        console.error('Statement failed:', e.message);
        // continue to next statement
      }
    }

    console.log('Migration applied (placement_cell.sql)');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

run();
