const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureStudentsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      mobile VARCHAR(50),
      email VARCHAR(255),
      course VARCHAR(255),
      batch VARCHAR(255),
      status VARCHAR(100) DEFAULT 'Active',
      placement_company VARCHAR(255) DEFAULT NULL,
      placement_role VARCHAR(255) DEFAULT NULL,
      resume_url TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureStudentsTable().catch((err) => {
  console.error("Failed to initialize students table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM students ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch students." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch student." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      course,
      batch,
      status,
      placement_company,
      placement_role,
      resume_url,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO students (name, mobile, email, course, batch, status, placement_company, placement_role, resume_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        mobile,
        email,
        course,
        batch,
        status || "Active",
        placement_company || null,
        placement_role || null,
        resume_url || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create student." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      course,
      batch,
      status,
      placement_company,
      placement_role,
      resume_url,
    } = req.body;

    const [result] = await db.query(
      `UPDATE students SET name = ?, mobile = ?, email = ?, course = ?, batch = ?, status = ?, placement_company = ?, placement_role = ?, resume_url = ? WHERE id = ?`,
      [
        name,
        mobile,
        email,
        course,
        batch,
        status || "Active",
        placement_company || null,
        placement_role || null,
        resume_url || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update student." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM students WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to delete student." });
  }
});

module.exports = router;
