const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureJobsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(200),
      role_name VARCHAR(200),
      experience VARCHAR(100),
      location VARCHAR(200),
      salary VARCHAR(100),
      description TEXT,
      apply_link TEXT,
      last_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureJobsTable().catch((err) => {
  console.error("Failed to initialize jobs table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch jobs." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      company_name,
      role_name,
      experience,
      location,
      salary,
      description,
      apply_link,
      last_date,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO jobs (company_name, role_name, experience, location, salary, description, apply_link, last_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        role_name,
        experience || null,
        location || null,
        salary || null,
        description || null,
        apply_link || null,
        last_date || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create job posting." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      company_name,
      role_name,
      experience,
      location,
      salary,
      description,
      apply_link,
      last_date,
    } = req.body;

    const [result] = await db.query(
      `UPDATE jobs SET company_name = ?, role_name = ?, experience = ?, location = ?, salary = ?, description = ?, apply_link = ?, last_date = ? WHERE id = ?`,
      [
        company_name,
        role_name,
        experience || null,
        location || null,
        salary || null,
        description || null,
        apply_link || null,
        last_date || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Job posting not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update job posting." });
  }
});

module.exports = router;
