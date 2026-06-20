const db = require('./config/db');
(async () => {
  try {
    const q = `SELECT b.id, b.batch_name, b.course_id, COALESCE(c.course_name,'') as course_name, b.start_date, b.end_date, NULL as max_students, 'Ongoing' as status, COUNT(DISTINCT bs.student_id) as student_count FROM batches b LEFT JOIN courses c ON b.course_id = c.id LEFT JOIN batch_students bs ON b.id = bs.batch_id WHERE b.trainer_id = ? GROUP BY b.id ORDER BY b.start_date DESC`;
    const [rows] = await db.query(q, [22]);
    console.log('OK', rows);
  } catch (e) {
    console.error('ERR', e);
  } finally {
    process.exit(0);
  }
})();