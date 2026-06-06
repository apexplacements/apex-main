const db = require('../config/db');

function safeInt(s){
  if (!s) return null;
  const m = String(s).match(/(\d+)/);
  return m ? parseInt(m[1],10) : null;
}

async function ensureColumn(table, columnDef){
  try{
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${columnDef}`);
    console.log('Added column', columnDef);
  }catch(e){
    // ignore if exists
  }
}

async function run(){
  try{
    console.log('Ensure batches has course_id and trainer_id');
    await ensureColumn('batches','course_id INT');
    await ensureColumn('batches','trainer_id INT');

    const [batches] = await db.query('SELECT * FROM batches');
    console.log('Batches to process:', batches.length);
    let coursesCreated=0, trainersCreated=0, batchesUpdated=0;

    for (const b of batches){
      const courseName = (b.course_name || b.course || '').trim();
      const trainerName = (b.trainer_name || b.trainer || '').trim();
      let courseId = null;
      if (courseName){
        const [rows] = await db.query('SELECT id FROM courses WHERE course_name = ? LIMIT 1', [courseName]);
        if (rows.length) courseId = rows[0].id;
        else{
          const duration = safeInt(b.duration) || safeInt(b.duration_hours) || null;
          const [res] = await db.query('INSERT INTO courses (course_name, description, duration_hours, created_at) VALUES (?,?,?,NOW())', [courseName, b.description || null, duration]);
          courseId = res.insertId;
          coursesCreated++;
        }
      }

      let trainerId = null;
      if (trainerName){
        const [trows] = await db.query('SELECT id FROM trainers WHERE trainer_name = ? LIMIT 1', [trainerName]);
        if (trows.length) trainerId = trows[0].id;
        else{
          const [tres] = await db.query('INSERT INTO trainers (trainer_name, mobile, created_at) VALUES (?,?,NOW())', [trainerName, b.mobile || null]);
          trainerId = tres.insertId;
          trainersCreated++;
        }
      }

      if (courseId || trainerId){
        await db.query('UPDATE batches SET course_id = ?, trainer_id = ? WHERE id = ?', [courseId, trainerId, b.id]);
        batchesUpdated++;
      }
    }

    console.log('Done. coursesCreated=', coursesCreated,'trainersCreated=', trainersCreated,'batchesUpdated=', batchesUpdated);
    process.exit(0);
  }catch(err){
    console.error('Migration error:', err.message, err.sqlMessage || '');
    process.exit(1);
  }
}

run();
