const db = require('./config/db');
(async () => {
  try {
    const [rows] = await db.query('SELECT 1 AS n');
    console.log('success', rows);
  } catch (err) {
    console.error('db error', err);
  }
})();
