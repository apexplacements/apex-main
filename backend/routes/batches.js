const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM batches ORDER BY created_at DESC"
  );

  res.json({
    success: true,
    data: rows,
  });
});

router.post("/", async (req, res) => {
  const {
    course_name,
    trainer_name,
    start_date,
    end_date,
  } = req.body;

  const [result] = await db.query(
    `
      INSERT INTO batches
      (
        course_name,
        trainer_name,
        start_date,
        end_date
      )
      VALUES (?,?,?,?)
    `,
    [
      course_name,
      trainer_name,
      start_date,
      end_date,
    ]
  );

  res.json({
    success: true,
    id: result.insertId,
  });
});

module.exports = router;