const db = require('../config/db');

(async function(){
  try{
    const [rows] = await db.query('SHOW COLUMNS FROM batches');
    console.log(rows);
    process.exit(0);
  }catch(err){
    console.error(err.message);
    process.exit(1);
  }
})();
