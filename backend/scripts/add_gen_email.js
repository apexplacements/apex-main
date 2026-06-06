(async()=>{
  const db = require('../config/db');
  try{
    const email = process.argv[2];
    const pwd = process.argv[3];
    const user_name = process.argv[4] || 'santhosh';
    const role = process.argv[5] || 'placementofficer';
    const user_id = process.argv[6] || 0;

    if(!email || !pwd){
      console.error('usage: node add_gen_email.js <email> <password> [user_name] [role] [user_id]');
      process.exit(2);
    }

    const [result] = await db.query(
      "INSERT INTO generated_emails (user_id,user_name,role,email,default_password,password,password_reset_required) VALUES (?,?,?,?,?,?,FALSE)",
      [user_id,user_name,role,email,pwd,pwd]
    );
    console.log(JSON.stringify({ok:true,insertId: result.insertId}));
  }catch(e){
    console.error(JSON.stringify({ok:false,error: String(e)}));
  }finally{ process.exit(); }
})();
