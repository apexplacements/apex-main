const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureResumesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      resume_url TEXT,
      status VARCHAR(100) DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureResumesTable().catch((err) => {
  console.error("Failed to initialize resumes table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, s.name AS student_name, s.email AS student_email FROM resumes r
       LEFT JOIN students s ON r.student_id = s.id
       ORDER BY r.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch resumes." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { student_id, resume_url, status } = req.body;

    const [result] = await db.query(
      `INSERT INTO resumes (student_id, resume_url, status)
       VALUES (?, ?, ?)`,
      [student_id || null, resume_url || null, status || "Pending"]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to save resume metadata." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, resume_url } = req.body;

    const [result] = await db.query(
      `UPDATE resumes SET status = ?, resume_url = ? WHERE id = ?`,
      [status || "Pending", resume_url || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Resume record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update resume record." });
  }
});

module.exports = router;
