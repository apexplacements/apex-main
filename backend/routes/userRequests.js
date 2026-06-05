const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM user_requests
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { full_name, phone, email, career_option } = req.body;

    if (!full_name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone, and Email are required"
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO user_requests
          (full_name, phone, email, career_option, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `,
      [
        full_name,
        phone,
        email,
        career_option || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Request submitted successfully!",
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to submit request",
    });
  }
});

router.put("/:id", async (req, res) => {
  const {
    full_name,
    phone,
    email,
    career_option,
  } = req.body;

  await db.query(
    `
      UPDATE user_requests
      SET full_name=?,
          phone=?,
          email=?,
          career_option=?
      WHERE id=?
    `,
    [
      full_name,
      phone,
      email,
      career_option,
      req.params.id,
    ]
  );

  res.json({
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  await db.query(
    "DELETE FROM user_requests WHERE id=?",
    [req.params.id]
  );

  res.json({
    success: true,
  });
});

module.exports = router;