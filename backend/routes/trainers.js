const express = require("express");
const router = express.Router();
const db = require("../config/db");

console.log('Loaded trainers route');

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM trainers ORDER BY created_at DESC"
    );

    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Error in GET /api/trainers:', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Error fetching trainers', error: err?.message });
  }
});

router.post("/", async (req, res) => {
  const [result] = await db.query(
    `
    INSERT INTO trainers
    (
      trainer_name,
      mobile,
      course,
      experience,
      info,
      key_points,
      photo_url
    )
    VALUES (?,?,?,?,?,?,?)
  `,
    [
      req.body.trainer_name,
      req.body.mobile,
      req.body.course,
      req.body.experience,
      req.body.info,
      req.body.key_points,
      req.body.photo_url,
    ]
  );

  res.json({
    success: true,
    id: result.insertId,
  });
});

router.put("/:id", async (req, res) => {
  await db.query(
    `
    UPDATE trainers
    SET
      trainer_name=?,
      mobile=?,
      course=?,
      experience=?,
      info=?,
      key_points=?,
      photo_url=?
    WHERE id=?
  `,
    [
      req.body.trainer_name,
      req.body.mobile,
      req.body.course,
      req.body.experience,
      req.body.info,
      req.body.key_points,
      req.body.photo_url,
      req.params.id,
    ]
  );

  res.json({
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  await db.query(
    "DELETE FROM trainers WHERE id=?",
    [req.params.id]
  );

  res.json({
    success: true,
  });
});

module.exports = router;