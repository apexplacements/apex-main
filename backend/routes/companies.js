const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureCompaniesTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(200),
      website VARCHAR(255),
      hr_name VARCHAR(200),
      hr_email VARCHAR(200),
      hr_mobile VARCHAR(20),
      location VARCHAR(200),
      logo_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureCompaniesTable().catch((err) => {
  console.error("Failed to initialize companies table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM companies ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch companies." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      company_name,
      website,
      hr_name,
      hr_email,
      hr_mobile,
      location,
      logo_url,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO companies (company_name, website, hr_name, hr_email, hr_mobile, location, logo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        website || null,
        hr_name || null,
        hr_email || null,
        hr_mobile || null,
        location || null,
        logo_url || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create company record." });
  }
});

module.exports = router;
