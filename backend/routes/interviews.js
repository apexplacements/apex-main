const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureInterviewsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS interviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      company_id INT,
      interview_date DATE,
      interview_time TIME,
      round_name VARCHAR(100),
      mode VARCHAR(50),
      status VARCHAR(50) DEFAULT 'Scheduled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureInterviewsTable().catch((err) => {
  console.error("Failed to initialize interviews table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.*, s.name AS student_name, c.company_name, c.hr_name as company_hr_name
       FROM interviews i
       LEFT JOIN students s ON i.student_id = s.id
       LEFT JOIN companies c ON i.company_id = c.id
       ORDER BY i.interview_date DESC, i.interview_time DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch interviews." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      student_id,
      company_id,
      interview_date,
      interview_time,
      round_name,
      mode,
      status,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO interviews (student_id, company_id, interview_date, interview_time, round_name, mode, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id || null,
        company_id || null,
        interview_date || null,
        interview_time || null,
        round_name || null,
        mode || "Online",
        status || "Scheduled",
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to schedule interview." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      student_id,
      company_id,
      interview_date,
      interview_time,
      round_name,
      mode,
      status,
    } = req.body;

    const [result] = await db.query(
      `UPDATE interviews SET student_id = ?, company_id = ?, interview_date = ?, interview_time = ?, round_name = ?, mode = ?, status = ? WHERE id = ?`,
      [
        student_id || null,
        company_id || null,
        interview_date || null,
        interview_time || null,
        round_name || null,
        mode || "Online",
        status || "Scheduled",
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Interview not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update interview." });
  }
});

module.exports = router;
