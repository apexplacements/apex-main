const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ============================================
// STUDENT ENROLLMENT & COURSES
// ============================================

// Get enrolled courses/batches for student
router.get("/:studentId/courses", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [courses] = await db.query(
      `SELECT b.id as batch_id, c.id as course_id, c.course_name, c.description, 
              c.duration_hours, b.start_date, b.end_date, t.trainer_name,
              ROUND(((SELECT COUNT(*) FROM student_progress 
                     WHERE student_id = ? AND batch_id = b.id AND is_completed = 1) /
              (SELECT COUNT(*) FROM lessons l 
               JOIN course_modules cm ON l.module_id = cm.id 
               WHERE cm.course_id = c.id) * 100), 2) as progress_percentage
       FROM batch_students bs
       JOIN batches b ON bs.batch_id = b.id
       JOIN courses c ON b.course_id = c.id
       JOIN trainers t ON b.trainer_id = t.id
       WHERE bs.student_id = ? AND bs.status = 'Active'
       ORDER BY b.start_date DESC`,
      [studentId, studentId]
    );

    res.json({ success: true, data: courses });
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
});

// ============================================
// COURSE CONTENT & LESSONS
// ============================================

// Get course modules and lessons
router.get("/:studentId/courses/:courseId/modules", async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const [modules] = await db.query(
      `SELECT cm.id, cm.module_number, cm.module_name, cm.description, cm.duration_minutes,
              COUNT(l.id) as total_lessons,
              (SELECT COUNT(*) FROM lessons l2 
               WHERE l2.module_id = cm.id AND EXISTS(
                 SELECT 1 FROM student_progress sp 
                 WHERE sp.student_id = ? AND sp.lesson_id = l2.id AND sp.is_completed = 1
               )) as completed_lessons
       FROM course_modules cm
       LEFT JOIN lessons l ON cm.id = l.module_id
       WHERE cm.course_id = ?
       GROUP BY cm.id
       ORDER BY cm.module_number`,
      [studentId, courseId]
    );

    const [lessons] = await db.query(
      `SELECT l.id, l.module_id, l.lesson_number, l.lesson_title, l.video_url, 
              l.video_duration_minutes,
              (SELECT is_completed FROM student_progress 
               WHERE student_id = ? AND lesson_id = l.id LIMIT 1) as is_completed,
              (SELECT watch_duration_minutes FROM student_progress 
               WHERE student_id = ? AND lesson_id = l.id LIMIT 1) as watch_duration
       FROM lessons l
       JOIN course_modules cm ON l.module_id = cm.id
       WHERE cm.course_id = ?
       ORDER BY l.module_id, l.sequence_order`,
      [studentId, studentId, courseId]
    );

    res.json({ success: true, data: { modules, lessons } });
  } catch (err) {
    console.error("Error fetching course content:", err);
    res.status(500).json({ success: false, message: "Error fetching course content" });
  }
});

// Get single lesson details
router.get("/:studentId/lessons/:lessonId", async (req, res) => {
  try {
    const { studentId, lessonId } = req.params;

    const [lesson] = await db.query(
      `SELECT l.*, cm.module_name FROM lessons l
       JOIN course_modules cm ON l.module_id = cm.id
       WHERE l.id = ?`,
      [lessonId]
    );

    if (!lesson.length) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const [progress] = await db.query(
      `SELECT * FROM student_progress WHERE student_id = ? AND lesson_id = ?`,
      [studentId, lessonId]
    );

    res.json({ success: true, data: { lesson: lesson[0], progress: progress[0] || null } });
  } catch (err) {
    console.error("Error fetching lesson:", err);
    res.status(500).json({ success: false, message: "Error fetching lesson" });
  }
});

// Update lesson progress
router.put("/:studentId/lessons/:lessonId/progress", async (req, res) => {
  try {
    const { studentId, lessonId } = req.params;
    const { batch_id, is_completed, watch_duration_minutes } = req.body;

    const [lesson] = await db.query(`SELECT id FROM lessons WHERE id = ?`, [lessonId]);
    if (!lesson.length) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    const [modules] = await db.query(`SELECT module_id FROM lessons WHERE id = ?`, [lessonId]);
    const module_id = modules[0].module_id;

    const [existing] = await db.query(
      `SELECT id FROM student_progress WHERE student_id = ? AND lesson_id = ?`,
      [studentId, lessonId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE student_progress 
         SET is_completed = ?, watch_duration_minutes = ?, 
             completed_at = ?, last_accessed_at = NOW()
         WHERE student_id = ? AND lesson_id = ?`,
        [is_completed, watch_duration_minutes, is_completed ? new Date() : null, studentId, lessonId]
      );
    } else {
      await db.query(
        `INSERT INTO student_progress 
         (student_id, batch_id, lesson_id, module_id, is_completed, watch_duration_minutes, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [studentId, batch_id, lessonId, module_id, is_completed, watch_duration_minutes, is_completed ? new Date() : null]
      );
    }

    res.json({ success: true, message: "Progress updated" });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ success: false, message: "Error updating progress" });
  }
});

// ============================================
// COURSE RESOURCES
// ============================================

// Get course resources
router.get("/:studentId/courses/:courseId/resources", async (req, res) => {
  try {
    const { courseId } = req.params;

    const [resources] = await db.query(
      `SELECT id, resource_title, resource_type, file_url, file_size_kb, created_at
       FROM course_resources
       WHERE course_id = ?
       ORDER BY resource_type, created_at DESC`,
      [courseId]
    );

    res.json({ success: true, data: resources });
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({ success: false, message: "Error fetching resources" });
  }
});

// ============================================
// ASSIGNMENTS
// ============================================

// Get assignments for course/batch
router.get("/:studentId/batches/:batchId/assignments", async (req, res) => {
  try {
    const { studentId, batchId } = req.params;

    const [assignments] = await db.query(
      `SELECT a.*, c.course_name,
              (SELECT status FROM assignment_submissions WHERE assignment_id = a.id AND student_id = ?) as submission_status,
              (SELECT marks_obtained FROM assignment_submissions WHERE assignment_id = a.id AND student_id = ?) as marks,
              (SELECT feedback FROM assignment_submissions WHERE assignment_id = a.id AND student_id = ?) as feedback
       FROM assignments a
       JOIN courses c ON a.course_id = c.id
       WHERE a.batch_id = ?
       ORDER BY a.due_date`,
      [studentId, studentId, studentId, batchId]
    );

    res.json({ success: true, data: assignments });
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ success: false, message: "Error fetching assignments" });
  }
});

// Submit assignment
router.post("/:studentId/assignments/:assignmentId/submit", async (req, res) => {
  try {
    const { studentId, assignmentId } = req.params;
    const { submitted_file_url } = req.body;

    const [existing] = await db.query(
      `SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?`,
      [assignmentId, studentId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE assignment_submissions 
         SET submitted_file_url = ?, submitted_at = NOW(), status = 'Submitted'
         WHERE assignment_id = ? AND student_id = ?`,
        [submitted_file_url, assignmentId, studentId]
      );
    } else {
      await db.query(
        `INSERT INTO assignment_submissions (assignment_id, student_id, submitted_file_url, status)
         VALUES (?, ?, ?, 'Submitted')`,
        [assignmentId, studentId, submitted_file_url]
      );
    }

    res.json({ success: true, message: "Assignment submitted successfully" });
  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ success: false, message: "Error submitting assignment" });
  }
});

// ============================================
// ATTENDANCE
// ============================================

// Get attendance record
router.get("/:studentId/batches/:batchId/attendance", async (req, res) => {
  try {
    const { studentId, batchId } = req.params;

    const [records] = await db.query(
      `SELECT attendance_date, status FROM attendance 
       WHERE student_id = ? AND batch_id = ?
       ORDER BY attendance_date DESC`,
      [studentId, batchId]
    );

    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    res.json({ success: true, data: { records, total, present, absent, percentage } });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
});

// ============================================
// MOCK TESTS
// ============================================

// Get mock tests for batch
router.get("/:studentId/batches/:batchId/tests", async (req, res) => {
  try {
    const { studentId, batchId } = req.params;

    const [tests] = await db.query(
      `SELECT t.*, c.course_name,
              (SELECT marks_obtained FROM test_attempts WHERE test_id = t.id AND student_id = ? ORDER BY attempted_at DESC LIMIT 1) as best_score,
              (SELECT COUNT(*) FROM test_attempts WHERE test_id = t.id AND student_id = ?) as attempts
       FROM mock_tests t
       JOIN courses c ON t.course_id = c.id
       WHERE t.batch_id = ?
       ORDER BY t.created_at DESC`,
      [studentId, studentId, batchId]
    );

    res.json({ success: true, data: tests });
  } catch (err) {
    console.error("Error fetching tests:", err);
    res.status(500).json({ success: false, message: "Error fetching tests" });
  }
});

// Get test attempts
router.get("/:studentId/tests/:testId/attempts", async (req, res) => {
  try {
    const { studentId, testId } = req.params;

    const [attempts] = await db.query(
      `SELECT * FROM test_attempts 
       WHERE test_id = ? AND student_id = ?
       ORDER BY attempted_at DESC`,
      [testId, studentId]
    );

    res.json({ success: true, data: attempts });
  } catch (err) {
    console.error("Error fetching attempts:", err);
    res.status(500).json({ success: false, message: "Error fetching attempts" });
  }
});

// ============================================
// CERTIFICATES
// ============================================

// Get certificates
router.get("/:studentId/certificates", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [certificates] = await db.query(
      `SELECT c.*, co.course_name FROM certificates c
       JOIN courses co ON c.course_id = co.id
       WHERE c.student_id = ?
       ORDER BY c.issued_date DESC`,
      [studentId]
    );

    res.json({ success: true, data: certificates });
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ success: false, message: "Error fetching certificates" });
  }
});

// ============================================
// ANNOUNCEMENTS
// ============================================

// Get announcements for enrolled batches
router.get("/:studentId/announcements", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [announcements] = await db.query(
      `SELECT a.*, t.trainer_name FROM announcements a
       LEFT JOIN trainers t ON a.created_by = t.id
       WHERE a.batch_id IN (
         SELECT batch_id FROM batch_students WHERE student_id = ?
       ) AND (a.valid_until IS NULL OR a.valid_until >= CURDATE())
       ORDER BY a.created_at DESC`,
      [studentId]
    );

    res.json({ success: true, data: announcements });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ success: false, message: "Error fetching announcements" });
  }
});

// ============================================
// PROGRESS & ANALYTICS
// ============================================

// Get learning progress dashboard
router.get("/:studentId/progress", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [progress] = await db.query(
      `SELECT 
        bs.batch_id,
        c.course_name,
        b.batch_name,
        COUNT(DISTINCT l.id) as total_lessons,
        (SELECT COUNT(*) FROM student_progress sp 
         WHERE sp.student_id = ? AND sp.batch_id = bs.batch_id AND sp.is_completed = 1) as completed_lessons,
        ROUND(((SELECT COUNT(*) FROM student_progress sp 
         WHERE sp.student_id = ? AND sp.batch_id = bs.batch_id AND sp.is_completed = 1) /
         COUNT(DISTINCT l.id) * 100), 2) as completion_percentage
       FROM batch_students bs
       JOIN batches b ON bs.batch_id = b.id
       JOIN courses c ON b.course_id = c.id
       LEFT JOIN course_modules cm ON c.id = cm.course_id
       LEFT JOIN lessons l ON cm.id = l.module_id
       WHERE bs.student_id = ?
       GROUP BY bs.batch_id`,
      [studentId, studentId, studentId]
    );

    res.json({ success: true, data: progress });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ success: false, message: "Error fetching progress" });
  }
});

module.exports = router;
