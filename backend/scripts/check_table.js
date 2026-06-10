const db = require('../config/db');

const table = process.argv[2];
const schema = process.env.DB_NAME || process.env.RDS_DB_NAME || process.env.RDS_DATABASE || 'apex_portal';

if (!table) {
  console.error('Usage: node check_table.js <table_name>');
  process.exit(1);
}

(async () => {
  try {
    const [rows] = await db.query(
      'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?',
      [schema, table]
    );

    if (!rows || rows.length === 0) {
      console.log(`NOT FOUND: Table ${table} does not exist in schema ${schema}`);
      process.exit(0);
    }

    console.log(`FOUND: Table ${table} exists in schema ${schema}`);

    const [cols] = await db.query(
      'SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION',
      [schema, table]
    );

    console.log('Columns:');
    cols.forEach(c => console.log(`- ${c.COLUMN_NAME}: ${c.COLUMN_TYPE} nullable=${c.IS_NULLABLE} default=${c.COLUMN_DEFAULT}`));

    process.exit(0);
  } catch (err) {
    console.error('Error querying information_schema:', err.message || err);
    process.exit(2);
  }
})();
