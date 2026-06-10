const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const { q, page = 1, perPage = 10 } = req.query;

    const whereClauses = [];
    const params = [];

    if (q) {
      whereClauses.push(`(LOWER(course_name) LIKE ? OR LOWER(trainer_name) LIKE ?)`);
      const qp = `%${String(q).toLowerCase()}%`;
      params.push(qp, qp);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM batches ${whereSql}`, params);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const per = Math.max(1, Math.min(100, parseInt(perPage, 10) || 10));
    const offset = (pageNum - 1) * per;

    const finalSql = `SELECT * FROM batches ${whereSql} ORDER BY created_at DESC LIMIT ${Number(per)} OFFSET ${Number(offset)}`;
    const [rows] = await db.query(finalSql, params);

    res.json({ success: true, data: rows, page: pageNum, perPage: per, total: Number(total || 0) });
  } catch (err) {
    console.error('[batches] GET / error', err);
    res.status(500).json({ success: false, error: err.message });
  }
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

router.put("/:id", async (req, res) => {
  try {
    const { course_name, trainer_name, start_date, end_date } = req.body;
    await db.query(
      `
        UPDATE batches
        SET course_name = ?, trainer_name = ?, start_date = ?, end_date = ?
        WHERE id = ?
      `,
      [course_name, trainer_name, start_date, end_date, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[batches] PUT /:id error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.query('DELETE FROM batches WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[batches] DELETE /:id error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;