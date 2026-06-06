(async()=>{
  const db = require('../config/db');
  try {
    const [rows] = await db.query("SELECT id,user_id,user_name,role,email,default_password,password,password_reset_required FROM generated_emails WHERE email = ? LIMIT 1", ['srikanth.po@apexplacements.in']);
    console.log(rows);
  } catch (e) {
    console.error('ERR', e);
  }
})();
