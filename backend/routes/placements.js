const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensurePlacementsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS placements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      company_name VARCHAR(200),
      role_name VARCHAR(200),
      package VARCHAR(100),
      placement_status VARCHAR(100) DEFAULT 'Placed',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensurePlacementsTable().catch((err) => {
  console.error("Failed to initialize placements table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, s.name AS student_name, s.email AS student_email
       FROM placements p
       LEFT JOIN students s ON p.student_id = s.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch placements." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { student_id, company_name, role_name, package: salaryPackage, placement_status } = req.body;

    const [result] = await db.query(
      `INSERT INTO placements (student_id, company_name, role_name, package, placement_status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        student_id || null,
        company_name || null,
        role_name || null,
        salaryPackage || null,
        placement_status || "Placed",
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create placement record." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { student_id, company_name, role_name, package: salaryPackage, placement_status } = req.body;

    const [result] = await db.query(
      `UPDATE placements SET student_id = ?, company_name = ?, role_name = ?, package = ?, placement_status = ? WHERE id = ?`,
      [
        student_id || null,
        company_name || null,
        role_name || null,
        salaryPackage || null,
        placement_status || "Placed",
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Placement record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update placement record." });
  }
});

module.exports = router;
