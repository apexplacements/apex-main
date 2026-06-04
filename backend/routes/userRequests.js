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