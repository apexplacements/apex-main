const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM courses ORDER BY id DESC"
  );

  res.json({
    success: true,
    data: rows,
  });
});

router.post("/", async (req, res) => {
  const { course_name, duration, fee, trainer_name, description, image_url, course_type } = req.body;

  await db.query(
    `
    INSERT INTO courses
    (
      course_name,
      duration,
      fee,
      trainer_name,
      description,
      image_url,
      course_type
    )
    VALUES (?,?,?,?,?,?,?)
  `,
    [course_name, duration, fee, trainer_name, description, image_url, course_type]
  );

  res.json({
    success: true,
  });
});

router.put("/:id", async (req, res) => {
  const { course_name, duration, fee, trainer_name, description, image_url, course_type } = req.body;

  await db.query(
    `
    UPDATE courses
    SET
      course_name=?,
      duration=?,
      fee=?,
      trainer_name=?,
      description=?,
      image_url=?,
      course_type=?
    WHERE id=?
  `,
    [
      course_name,
      duration,
      fee,
      trainer_name,
      description,
      image_url,
      course_type,
      req.params.id,
    ]
  );

  res.json({
    success: true,
  });
});

router.delete("/:id", async (req, res) => {
  await db.query(
    "DELETE FROM courses WHERE id=?",
    [req.params.id]
  );

  res.json({
    success: true,
  });
});

module.exports = router;