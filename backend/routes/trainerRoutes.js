const express = require("express");
const router = express.Router();
const db = require("../config/db");
console.log('Loaded trainerRoutes');

// Ensure batches table has expected columns (run-once tolerant)
const ensureBatchesColumns = async () => {
  try {
    await db.query(`ALTER TABLE batches ADD COLUMN batch_name VARCHAR(255)`);
    console.log('[trainerRoutes] Added missing column batch_name to batches table');
  } catch (err) {
    // Ignore if column already exists or other benign errors
    if (err && err.code) {
      console.log('[trainerRoutes] ensureBatchesColumns check:', err.code);
    }
  }
};

ensureBatchesColumns().catch((e) => console.warn('ensureBatchesColumns failed:', e && e.message));

// Debug: log incoming requests to this router
router.use((req, res, next) => {
  try {
    console.log(`trainerRoutes: ${req.method} ${req.originalUrl || req.url}`);
  } catch (e) {}
  next();
});

// ============================================
// TRAINER PROFILE ROUTES
// ============================================

// Get trainer profile
router.get("/profile/:trainerId", async (req, res) => {
  try {
    const { trainerId } = req.params;

    const [trainer] = await db.query(
      `SELECT id, trainer_name, email, mobile, experience_years, 
              specialization, bio, photo_url, certification, is_active 
       FROM trainers WHERE id = ?`,
      [trainerId]
    );

    if (!trainer.length) {
      console.warn(`Trainer profile not found for id=${trainerId}`);
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    res.json({ success: true, data: trainer[0] });
  } catch (err) {
    console.error("Error fetching trainer profile:", err);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// Get trainer by user id (maps application user -> trainer record)
router.get("/by-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT id, user_id, trainer_name, email, mobile, experience_years, 
              specialization, bio, photo_url, certification, is_active 
       FROM trainers WHERE user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      console.warn(`Trainer not found for user_id=${userId}`);
      return res.status(404).json({ success: false, message: "Trainer not found for user" });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("Error fetching trainer by user:", err);
    res.status(500).json({ success: false, message: "Error fetching trainer" });
  }
});

// Update trainer profile
router.put("/profile/:trainerId", async (req, res) => {
  try {
    const { trainerId } = req.params;
    console.log(`[trainerRoutes] PUT /profile/${trainerId} payload:`, req.body);
    const { trainer_name, mobile, specialization, bio, photo_url, certification } = req.body;
    // First try updating by trainer id
    const [updateResult] = await db.query(
      `UPDATE trainers SET trainer_name=?, mobile=?, specialization=?, bio=?, photo_url=?, certification=? WHERE id = ?`,
      [trainer_name || null, mobile || null, specialization || null, bio || null, photo_url || null, certification || null, trainerId]
    );

    if (updateResult.affectedRows > 0) {
      return res.json({ success: true, message: "Profile updated successfully" });
    }

    // If not found by id, attempt to update by user_id (frontend may send application user id)
    const [updateByUser] = await db.query(
      `UPDATE trainers SET trainer_name=?, mobile=?, specialization=?, bio=?, photo_url=?, certification=? WHERE user_id = ?`,
      [trainer_name || null, mobile || null, specialization || null, bio || null, photo_url || null, certification || null, trainerId]
    );

    if (updateByUser.affectedRows > 0) {
      return res.json({ success: true, message: "Profile updated successfully (by user mapping)" });
    }

    // If still not found, create a new trainer record and associate with this user id
    const [insertResult] = await db.query(
      `INSERT INTO trainers (user_id, trainer_name, mobile, specialization, bio, photo_url, certification, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [trainerId, trainer_name || null, mobile || null, specialization || null, bio || null, photo_url || null, certification || null]
    );

    if (insertResult.insertId) {
      return res.json({ success: true, message: "Trainer profile created successfully", id: insertResult.insertId });
    }

    res.status(500).json({ success: false, message: "Unable to update or create trainer profile" });
  } catch (err) {
    console.error("Error updating trainer profile:", err);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
});

// ============================================
// BATCH MANAGEMENT ROUTES
// ============================================

// Get trainer's batches
router.get("/:trainerId/batches", async (req, res) => {
  try {
    const { trainerId } = req.params;
    console.log(`[trainerRoutes] fetching batches for trainerId=${trainerId}`);

    const [batches] = await db.query(
      `SELECT b.id,
              b.batch_name,
              b.course_id,
              COALESCE(c.course_name, '') as course_name,
              b.start_date,
              b.end_date,
              NULL as max_students,
              'Ongoing' as status,
              COUNT(DISTINCT bs.student_id) as student_count
       FROM batches b
       LEFT JOIN courses c ON b.course_id = c.id
       LEFT JOIN batch_students bs ON b.id = bs.batch_id
       WHERE b.trainer_id = ?
       GROUP BY b.id
       ORDER BY b.start_date DESC`,
      [trainerId]
    );
    console.log('[trainerRoutes] fetched batches count=', batches.length);
    res.json({ success: true, data: batches });
  } catch (err) {
    console.error("Error fetching batches:", err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: "Error fetching batches" });
  }
});

// Create batch
router.post("/:trainerId/batches", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { course_id, batch_name, start_date, end_date } = req.body;

    const [result] = await db.query(
      `INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date)
       VALUES (?, ?, ?, ?, ?)`,
      [course_id, trainerId, batch_name, start_date, end_date]
    );

    res.json({ success: true, message: "Batch created successfully", batchId: result.insertId });
  } catch (err) {
    console.error("Error creating batch:", err);
    res.status(500).json({ success: false, message: "Error creating batch" });
  }
});

// ============================================
// STUDENT MANAGEMENT ROUTES
// ============================================

// Get students in batch
router.get("/:trainerId/batches/:batchId/students", async (req, res) => {
  try {
    const { trainerId, batchId } = req.params;

    const [students] = await db.query(
      `SELECT ge.id, ge.user_name, ge.email, bs.enrollment_date, 
              bs.status, 
              (SELECT COUNT(*) FROM attendance WHERE batch_id = ? AND student_id = ge.id 
               AND status = 'Present') as present_count,
              (SELECT COUNT(*) FROM attendance WHERE batch_id = ? AND student_id = ge.id) as total_attendance
       FROM batch_students bs
       JOIN generated_emails ge ON bs.student_id = ge.id
       WHERE bs.batch_id = ? AND bs.student_id IN
       (SELECT DISTINCT student_id FROM batch_students WHERE batch_id = ?)`,
      [batchId, batchId, batchId, batchId]
    );

    res.json({ success: true, data: students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, message: "Error fetching students" });
  }
});

// Add student to batch
router.post("/:trainerId/batches/:batchId/students", async (req, res) => {
  try {
    const { trainerId, batchId } = req.params;
    const { student_id } = req.body;

    const [result] = await db.query(
      `INSERT INTO batch_students (batch_id, student_id, status) VALUES (?, ?, 'Active')`,
      [batchId, student_id]
    );

    res.json({ success: true, message: "Student added to batch" });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ success: false, message: "Error adding student" });
  }
});

// Debug: show columns for batches table
router.get("/debug/batches-columns", async (req, res) => {
  try {
    const [cols] = await db.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'batches' AND TABLE_SCHEMA = DATABASE()`
    );
    res.json({ success: true, data: cols });
  } catch (err) {
    console.error('Error fetching batches columns:', err);
    res.status(500).json({ success: false, message: 'Error fetching columns' });
  }
});

// Debug: show sample rows from batches
router.get("/debug/batches-sample", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM batches LIMIT 10`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error fetching sample batches rows:', err);
    res.status(500).json({ success: false, message: 'Error fetching sample rows' });
  }
});

// Debug: try inserting a test batch to reproduce error and return details
router.post("/debug/batches-insert-test", async (req, res) => {
  try {
    const { course_id = 1, trainer_id = 22, batch_name = 'TestRun', start_date = '2026-06-10', end_date = '2026-07-10', max_students = 10 } = req.body || {};
    const [result] = await db.query(
      `INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date, max_students) VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, trainer_id, batch_name, start_date, end_date, max_students]
    );
    res.json({ success: true, result });
  } catch (err) {
    console.error('Debug insert error:', err);
    res.status(500).json({ success: false, message: 'Debug insert failed', error: err && err.message, code: err && err.code });
  }
});

// Debug: insert using only minimal columns present in table
router.post("/debug/batches-insert-simple", async (req, res) => {
  try {
    const { course_id = 1, trainer_id = 22, batch_name = 'SimpleTest', start_date = '2026-06-10', end_date = '2026-07-10' } = req.body || {};
    const [result] = await db.query(
      `INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date) VALUES (?, ?, ?, ?, ?)`,
      [course_id, trainer_id, batch_name, start_date, end_date]
    );
    res.json({ success: true, result });
  } catch (err) {
    console.error('Debug simple insert error:', err);
    res.status(500).json({ success: false, message: 'Debug simple insert failed', error: err && err.message, code: err && err.code });
  }
});

// ============================================
// ATTENDANCE MANAGEMENT ROUTES
// ============================================

// Mark attendance
router.post("/:trainerId/batches/:batchId/attendance", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { attendance_data } = req.body;
    // attendance_data: [{ student_id, status, date }]

    for (const record of attendance_data) {
      await db.query(
        `INSERT INTO attendance (batch_id, student_id, attendance_date, status) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [batchId, record.student_id, record.date, record.status, record.status]
      );
    }

    res.json({ success: true, message: "Attendance marked successfully" });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ success: false, message: "Error marking attendance" });
  }
});

// Get attendance report
router.get("/:trainerId/batches/:batchId/attendance-report", async (req, res) => {
  try {
    const { batchId } = req.params;
    const { student_id } = req.query;

    let query = `SELECT a.*, ge.user_name FROM attendance a
                 JOIN generated_emails ge ON a.student_id = ge.id
                 WHERE a.batch_id = ?`;
    const params = [batchId];

    if (student_id) {
      query += ` AND a.student_id = ?`;
      params.push(student_id);
    }

    query += ` ORDER BY a.attendance_date DESC`;

    const [records] = await db.query(query, params);
    res.json({ success: true, data: records });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
});

// ============================================
// ASSIGNMENT MANAGEMENT ROUTES
// ============================================

// Create assignment
router.post("/:trainerId/batches/:batchId/assignments", async (req, res) => {
  try {
    const { trainerId, batchId } = req.params;
    const { course_id, assignment_title, description, assignment_file_url, due_date, total_marks } = req.body;

    const [result] = await db.query(
      `INSERT INTO assignments (batch_id, course_id, assignment_title, description, 
                                assignment_file_url, due_date, total_marks, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [batchId, course_id, assignment_title, description, assignment_file_url, due_date, total_marks, trainerId]
    );

    res.json({ success: true, message: "Assignment created", assignmentId: result.insertId });
  } catch (err) {
    console.error("Error creating assignment:", err);
    res.status(500).json({ success: false, message: "Error creating assignment" });
  }
});

// Get assignments for batch
router.get("/:trainerId/batches/:batchId/assignments", async (req, res) => {
  try {
    const { batchId } = req.params;

    const [assignments] = await db.query(
      `SELECT a.*, c.course_name FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE a.batch_id = ?
       ORDER BY a.created_at DESC`,
      [batchId]
    );

    res.json({ success: true, data: assignments });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ success: false, message: "Error fetching assignments" });
  }
});

// Get assignment submissions for review
router.get("/:trainerId/assignments/:assignmentId/submissions", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const [submissions] = await db.query(
      `SELECT sub.*, ge.user_name, ge.email 
       FROM assignment_submissions sub
       JOIN generated_emails ge ON sub.student_id = ge.id
       WHERE sub.assignment_id = ?
       ORDER BY sub.submitted_at DESC`,
      [assignmentId]
    );

    res.json({ success: true, data: submissions });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
});

// Grade assignment
router.put("/:trainerId/submissions/:submissionId/grade", async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks_obtained, feedback, trainerId } = req.body;

    const [result] = await db.query(
      `UPDATE assignment_submissions 
       SET marks_obtained = ?, feedback = ?, status = 'Graded', graded_by = ?, graded_at = NOW()
       WHERE id = ?`,
      [marks_obtained, feedback, trainerId, submissionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    res.json({ success: true, message: "Assignment graded successfully" });
  } catch (err) {
    console.error("Error grading assignment:", err);
    res.status(500).json({ success: false, message: "Error grading assignment" });
  }
});

// ============================================
// ANNOUNCEMENTS ROUTES
// ============================================

// Create announcement
router.post("/:trainerId/announcements", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { batch_id, course_id, title, content, announcement_type, valid_until } = req.body;

    const [result] = await db.query(
      `INSERT INTO announcements (batch_id, course_id, title, content, announcement_type, created_by, valid_until)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [batch_id, course_id, title, content, announcement_type, trainerId, valid_until]
    );

    res.json({ success: true, message: "Announcement created", announcementId: result.insertId });
  } catch (err) {
    console.error("Error creating announcement:", err);
    res.status(500).json({ success: false, message: "Error creating announcement" });
  }
});

// Get announcements for batch
router.get("/:trainerId/batches/:batchId/announcements", async (req, res) => {
  try {
    const { batchId } = req.params;

    const [announcements] = await db.query(
      `SELECT a.*, t.trainer_name FROM announcements a
       LEFT JOIN trainers t ON a.created_by = t.id
       WHERE a.batch_id = ? AND (a.valid_until IS NULL OR a.valid_until >= CURDATE())
       ORDER BY a.created_at DESC`,
      [batchId]
    );

    res.json({ success: true, data: announcements });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ success: false, message: "Error fetching announcements" });
  }
});

// ============================================
// PROGRESS ANALYTICS ROUTES
// ============================================

// Get batch analytics
router.get("/:trainerId/batches/:batchId/analytics", async (req, res) => {
  try {
    const { batchId } = req.params;

    const [analytics] = await db.query(
      `SELECT 
        bs.student_id,
        ge.user_name,
        COUNT(DISTINCT sp.lesson_id) as lessons_completed,
        (SELECT COUNT(*) FROM lessons l 
         JOIN course_modules cm ON l.module_id = cm.id 
         WHERE cm.course_id = (SELECT course_id FROM batches WHERE id = ?)) as total_lessons,
        (SELECT COUNT(*) FROM attendance WHERE batch_id = ? AND student_id = bs.student_id AND status = 'Present') as attendance_count,
        ROUND(((SELECT COUNT(*) FROM student_progress WHERE batch_id = ? AND student_id = bs.student_id AND is_completed = 1) / 
        (SELECT COUNT(*) FROM lessons l 
         JOIN course_modules cm ON l.module_id = cm.id 
         WHERE cm.course_id = (SELECT course_id FROM batches WHERE id = ?)) * 100), 2) as completion_percentage
       FROM batch_students bs
       JOIN generated_emails ge ON bs.student_id = ge.id
       LEFT JOIN student_progress sp ON bs.student_id = sp.student_id AND sp.batch_id = bs.batch_id
       WHERE bs.batch_id = ?
       GROUP BY bs.student_id`,
      [batchId, batchId, batchId, batchId, batchId]
    );

    res.json({ success: true, data: analytics });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ success: false, message: "Error fetching analytics" });
  }
});

module.exports = router;
