const express = require("express");
const router = express.Router();
const db = require("../config/db");

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
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    res.json({ success: true, data: trainer[0] });
  } catch (err) {
    console.error("Error fetching trainer profile:", err);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
});

// Update trainer profile
router.put("/profile/:trainerId", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { trainer_name, mobile, specialization, bio, photo_url, certification } = req.body;

    const [result] = await db.query(
      `UPDATE trainers SET trainer_name=?, mobile=?, specialization=?, 
              bio=?, photo_url=?, certification=? WHERE id = ?`,
      [trainer_name, mobile, specialization, bio, photo_url, certification, trainerId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    res.json({ success: true, message: "Profile updated successfully" });
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

    const [batches] = await db.query(
      `SELECT b.id, b.batch_name, b.course_id, c.course_name, b.start_date, 
              b.end_date, b.max_students, b.status,
              COUNT(DISTINCT bs.student_id) as enrolled_students
       FROM batches b
       JOIN courses c ON b.course_id = c.id
       LEFT JOIN batch_students bs ON b.id = bs.batch_id
       WHERE b.trainer_id = ?
       GROUP BY b.id
       ORDER BY b.start_date DESC`,
      [trainerId]
    );

    res.json({ success: true, data: batches });
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ success: false, message: "Error fetching batches" });
  }
});

// Create batch
router.post("/:trainerId/batches", async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { course_id, batch_name, start_date, end_date, max_students } = req.body;

    const [result] = await db.query(
      `INSERT INTO batches (course_id, trainer_id, batch_name, start_date, end_date, max_students)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [course_id, trainerId, batch_name, start_date, end_date, max_students]
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
