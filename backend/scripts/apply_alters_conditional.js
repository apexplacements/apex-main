const db = require('../config/db');

async function columnExists(table, column){
  const [rows] = await db.query(
    `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [process.env.DB_NAME || 'apex_portal', table, column]
  );
  return rows[0].cnt > 0;
}

async function addColumn(table, columnDef){
  try{
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
    console.log(`Added column to ${table}: ${columnDef}`);
  }catch(err){
    console.error('Error adding column', columnDef, err.sqlMessage || err.message);
  }
}

async function run(){
  try{
    if (!(await columnExists('courses','duration_hours'))){
      await addColumn('courses','duration_hours INT');
    } else console.log('courses.duration_hours exists');

    if (!(await columnExists('courses','difficulty_level'))){
      await addColumn('courses', "difficulty_level ENUM('Beginner','Intermediate','Advanced') DEFAULT 'Beginner'");
    }

    if (!(await columnExists('courses','course_type'))){
      await addColumn('courses', "course_type VARCHAR(50)");
    } else console.log('courses.course_type exists');

    // trainers columns
    const trainerCols = [
      ['user_id','INT'],
      ['email','VARCHAR(255)'],
      ['experience_years','INT'],
      ['specialization','VARCHAR(255)'],
      ['bio','TEXT'],
      ['certification','TEXT'],
      ['is_active','BOOLEAN DEFAULT TRUE'],
    ];
    for (const [col,def] of trainerCols){
      if (!(await columnExists('trainers',col))){
        await addColumn('trainers', `${col} ${def}`);
      } else console.log(`trainers.${col} exists`);
    }

    console.log('All ALTER checks complete');
    process.exit(0);
  }catch(err){
    console.error(err.message);
    process.exit(1);
  }
}

run();
