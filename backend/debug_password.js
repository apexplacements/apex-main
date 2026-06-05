require('dotenv').config();
const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query(
      "SELECT id, user_id, user_name, role, email, default_password, password FROM generated_emails WHERE email = ? LIMIT 1",
      ['skumarreddy.admin@apexplacements.in']
    );
    
    if (rows.length) {
      console.log('Found user:');
      console.log('  id:', rows[0].id);
      console.log('  user_name:', rows[0].user_name);
      console.log('  role:', rows[0].role);
      console.log('  email:', rows[0].email);
      console.log('  password column:', rows[0].password);
      console.log('  default_password column:', rows[0].default_password);
      console.log('\nUse password:', rows[0].password || rows[0].default_password);
    } else {
      console.log('User not found');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
