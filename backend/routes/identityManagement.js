const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../config/db");

const router = express.Router();
const uploadDir = path.join(__dirname, "..", "uploads", "identity_photos");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const cleaned = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\.-]/g, "");
    cb(null, `${Date.now()}-${cleaned}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const initializeTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS identity_management (
        id INT AUTO_INCREMENT PRIMARY KEY,
        generated_email_id INT NULL,
        id_no VARCHAR(100) NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(100) NULL,
        email VARCHAR(255) NOT NULL,
        photo_path VARCHAR(512) NULL,
        batch_id VARCHAR(100) NULL,
        course VARCHAR(255) NULL,
        valid_upto DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  } catch (err) {
    console.error("Failed to initialize identity_management table:", err);
  }
};

initializeTable();

router.post("/", upload.single("photo"), async (req, res) => {
  const {
    selectedEmailId,
    idNo,
    fullName,
    role,
    email,
    batchId,
    course,
    validUpto,
  } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: "Full name and email are required",
    });
  }

  try {
    const photoPath = req.file
      ? `/uploads/identity_photos/${req.file.filename}`
      : null;

    await db.query(
      `INSERT INTO identity_management (generated_email_id, id_no, full_name, role, email, photo_path, batch_id, course, valid_upto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        selectedEmailId || null,
        idNo || null,
        fullName,
        role || null,
        email,
        photoPath,
        batchId || null,
        course || null,
        validUpto || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Identity record saved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to save identity record",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, generated_email_id, id_no, full_name, role, email, photo_path, batch_id, course, valid_upto, created_at FROM identity_management ORDER BY created_at DESC LIMIT 100`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load identity records",
    });
  }
});

module.exports = router;
