// Debug script to check trainer account in database
const db = require('./config/db');

async function checkTrainerAccount() {
  try {
    console.log('\n=== CHECKING TRAINER ACCOUNT ===\n');
    
    const email = 'srikanth.tr@apexplacements.in';
    
    // Check generated_emails table
    const [generated] = await db.query(
      "SELECT id, user_id, user_name, role, email, default_password, password FROM generated_emails WHERE email = ?",
      [email]
    );
    
    console.log('Generated Emails Result:');
    if (generated.length > 0) {
      console.log(`  Found: ${generated[0].user_name} (${generated[0].role})`);
      console.log(`  Default Password: ${generated[0].default_password}`);
      console.log(`  Stored Password: ${generated[0].password}`);
    } else {
      console.log('  NOT FOUND - Need to insert trainer account');
    }
    
    // Check if any trainer accounts exist
    console.log('\n--- All Trainer Accounts ---');
    const [allTrainers] = await db.query(
      "SELECT id, user_id, user_name, email, role FROM generated_emails WHERE role = 'tr' LIMIT 10"
    );
    
    if (allTrainers.length > 0) {
      allTrainers.forEach(t => {
        console.log(`  ${t.email} (ID: ${t.id})`);
      });
    } else {
      console.log('  NO TRAINER ACCOUNTS FOUND');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkTrainerAccount();
