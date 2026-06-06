const db = require('./config/db');

(async () => {
  try {
    const [rows] = await db.query(
      "SELECT email, password, default_password FROM generated_emails WHERE email='srikanth.hr@apexplacements.in'"
    );
    console.log('Database record:', rows[0]);
    console.log('Password field:', rows[0]?.password);
    console.log('Default password:', rows[0]?.default_password);
    console.log('Password length:', rows[0]?.password?.length);
    
    // Test simple comparison
    const plainPassword = '1234';
    console.log('Plain password match with default_password:', rows[0]?.default_password === plainPassword);
    console.log('Plain password match with password:', rows[0]?.password === plainPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
