const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function run() {
  try {
    const sqlPath = path.join(__dirname, '..', 'migrations', '002_student_enquiry.sql');
    const raw = fs.readFileSync(sqlPath, 'utf8');

    // Remove SQL line comments and trim
    const noComments = raw.split('\n').filter(l => !l.trim().startsWith('--')).join('\n');

    // Split statements by semicolon and execute sequentially, but handle the data-copy INSERT specially
    const statements = noComments.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);

    for (const stmt of statements) {
      // If statement starts with INSERT INTO student_enquiry and SELECT from user_requests, handle dynamically
      if (/INSERT INTO student_enquiry[\s\S]*SELECT[\s\S]*FROM user_requests/i.test(stmt)) {
        console.log('Preparing data copy from user_requests into student_enquiry...');

        // Check if user_requests exists and whether it has job_type column
        let hasJobType = false;
        try {
          const [cols] = await db.query("SHOW COLUMNS FROM user_requests");
          hasJobType = cols.some(c => c.Field === 'job_type');
        } catch (e) {
          console.warn('user_requests table not found or error reading columns:', e.message);
        }

        const selectJobType = hasJobType ? 'ur.job_type' : 'NULL as job_type';

        const insertSql = `INSERT INTO student_enquiry (id, full_name, phone, email, career_option, job_type, created_at)\nSELECT ur.id, ur.full_name, ur.phone, ur.email, ur.career_option, ${selectJobType}, ur.created_at\nFROM user_requests ur\nLEFT JOIN student_enquiry se ON se.id = ur.id\nWHERE se.id IS NULL`;

        console.log('Executing data-copy statement...');
        await db.query(insertSql);
        continue;
      }

      // Handle CREATE INDEX IF NOT EXISTS separately for MySQL compatibility
      if (/^CREATE INDEX IF NOT EXISTS\s+/i.test(stmt)) {
        const m = stmt.match(/^CREATE INDEX IF NOT EXISTS\s+(\S+)\s+ON\s+(\S+)\s*\(([^)]+)\)/i);
        if (m) {
          const indexName = m[1];
          const tableName = m[2].replace(/`/g, '');
          // check information_schema for existing index
          const [rows] = await db.query(
            `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ?`,
            [process.env.DB_NAME || process.env.RDS_DB_NAME || '', tableName, indexName]
          );
          if (rows && rows[0] && rows[0].cnt === 0) {
            const plainCreate = `CREATE INDEX ${indexName} ON ${tableName} (${m[3]})`;
            console.log('Creating index:', indexName);
            await db.query(plainCreate);
          } else {
            console.log('Index already exists:', indexName);
          }
          continue;
        }
      }

      console.log('Executing statement:', stmt.slice(0, 80).replace(/\n/g, ' ') + (stmt.length>80? '...':''));
      await db.query(stmt);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
