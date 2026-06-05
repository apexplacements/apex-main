const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensurePlacementDrivesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS placement_drives (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(200),
      role_name VARCHAR(200),
      location VARCHAR(200),
      ctc VARCHAR(100),
      interview_date DATE,
      eligibility TEXT,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensurePlacementDrivesTable().catch((err) => {
  console.error("Failed to initialize placement_drives table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM placement_drives ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch placement drives." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      company_name,
      role_name,
      location,
      ctc,
      interview_date,
      eligibility,
      status,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO placement_drives (company_name, role_name, location, ctc, interview_date, eligibility, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        role_name,
        location,
        ctc,
        interview_date || null,
        eligibility || null,
        status || "Active",
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create placement drive." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      company_name,
      role_name,
      location,
      ctc,
      interview_date,
      eligibility,
      status,
    } = req.body;

    const [result] = await db.query(
      `UPDATE placement_drives SET company_name = ?, role_name = ?, location = ?, ctc = ?, interview_date = ?, eligibility = ?, status = ? WHERE id = ?`,
      [
        company_name,
        role_name,
        location,
        ctc,
        interview_date || null,
        eligibility || null,
        status || "Active",
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Placement drive not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update placement drive." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM placement_drives WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Placement drive not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to delete placement drive." });
  }
});

module.exports = router;
