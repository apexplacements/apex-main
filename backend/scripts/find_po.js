(async()=>{
  const db = require('../config/db');
  try {
    const [rows] = await db.query("SELECT id,user_id,user_name,role,email FROM generated_emails WHERE role LIKE '%placement%' LIMIT 100");
    console.log('FOUND', rows.length);
    console.table(rows);
  } catch (e) {
    console.error('ERR', e);
  }
})();
