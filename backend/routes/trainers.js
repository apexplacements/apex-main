const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM trainers ORDER BY created_at DESC"
  );

  res.json({
    success: true,
    data: rows,
  });
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