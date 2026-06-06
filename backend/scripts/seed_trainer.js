// Usage: node seed_trainer.js <user_id> <trainer_name> <email> [mobile]
// Example: node seed_trainer.js 123 "Srikanth PO" srikanth.po@apexplacements.in 9000123456

const db = require("../config/db");

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: node seed_trainer.js <user_id> <trainer_name> <email> [mobile]");
    process.exit(1);
  }

  const [user_id, trainer_name, email, mobile] = args;

  try {
    const [result] = await db.query(
      `INSERT INTO trainers (user_id, trainer_name, email, mobile, experience_years, specialization, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, trainer_name, email, mobile || null, 0, null]
    );

    console.log('Inserted trainer with id =', result.insertId);
    process.exit(0);
  } catch (err) {
    console.error('Error inserting trainer:', err);
    process.exit(2);
  }
}

main();
