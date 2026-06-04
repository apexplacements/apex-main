const db = require('../config/db');

const admins = [
  'skumarreddy.admin@apexplacements.in',
  'nhosanna.admin@apexplacements.in',
  'mkrishna.admin@gmail.com',
  'ykumar.admin@apexplacements.in',
];

(async function(){
  try {
    const values = admins.map(email => [0, 'Administrator', 'admin', email, 'admin@123', null, 0]);
    // columns: user_id, user_name, role, email, default_password, password, password_reset_required
    await db.query(`
      INSERT INTO generated_emails (user_id, user_name, role, email, default_password, password, password_reset_required)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        user_name = VALUES(user_name),
        role = VALUES(role),
        default_password = VALUES(default_password),
        password_reset_required = VALUES(password_reset_required)
    `, [values]);

    console.log('Admin accounts ensured.');
  } catch (err) {
    console.error('Failed to ensure admin accounts:', err.message);
  } finally {
    process.exit(0);
  }
})();
