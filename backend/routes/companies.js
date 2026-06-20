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
      apply_link TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add apply_link column if it doesn't exist
  try {
    await db.query(`ALTER TABLE companies ADD COLUMN apply_link TEXT`);
  } catch (err) {
    // Column already exists, ignore error
    if (err.code !== "ER_DUP_FIELDNAME") {
      console.error("Error adding apply_link column:", err.message);
    }
  }
};

ensureCompaniesTable().catch((err) => {
  console.error("Failed to initialize companies table:", err);
});

// GET all companies
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM companies ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch companies." });
  }
});

// Export for debugging
module.exports.__debug = 'companies route loaded';

// GET single company by ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM companies WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Company not found." });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch company." });
  }
});

// POST create new company
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
      apply_link,
    } = req.body;

    if (!company_name || company_name.trim() === "") {
      return res.status(400).json({ success: false, message: "Company name is required." });
    }

    const [result] = await db.query(
      `INSERT INTO companies (company_name, website, hr_name, hr_email, hr_mobile, location, logo_url, apply_link)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        company_name,
        website || null,
        hr_name || null,
        hr_email || null,
        hr_mobile || null,
        location || null,
        logo_url || null,
        apply_link || null,
      ]
    );

    console.log(`[COMPANIES] CREATE success: ID ${result.insertId} - ${company_name}`);
    res.json({ success: true, id: result.insertId, message: "Company created successfully." });
  } catch (err) {
    console.error("[COMPANIES] CREATE error:", err.message, err.code);
    res.status(500).json({ success: false, message: "Unable to create company record. " + err.message });
  }
});

// PUT update company
router.put("/:id", async (req, res) => {
  try {
    const {
      company_name,
      website,
      hr_name,
      hr_email,
      hr_mobile,
      location,
      logo_url,
      apply_link,
    } = req.body;

    const [result] = await db.query(
      `UPDATE companies SET company_name=?, website=?, hr_name=?, hr_email=?, hr_mobile=?, location=?, logo_url=?, apply_link=?
       WHERE id=?`,
      [
        company_name || null,
        website || null,
        hr_name || null,
        hr_email || null,
        hr_mobile || null,
        location || null,
        logo_url || null,
        apply_link || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      console.warn(`[COMPANIES] UPDATE failed: Company ID ${req.params.id} not found`);
      return res.status(404).json({ success: false, message: "Company not found." });
    }

    console.log(`[COMPANIES] UPDATE success: ID ${req.params.id} - ${company_name || "unknown"}`);
    res.json({ success: true, message: "Company updated successfully." });
  } catch (err) {
    console.error("[COMPANIES] UPDATE error:", err.message, err.code);
    res.status(500).json({ success: false, message: "Unable to update company. " + err.message });
  }
});

// DELETE company
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM companies WHERE id = ?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Company not found." });
    }

    res.json({ success: true, message: "Company deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to delete company." });
  }
});

module.exports = router;
