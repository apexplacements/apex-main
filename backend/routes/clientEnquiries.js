const express = require("express");
const router = express.Router();
const pool = require("../clientdb");

const CUSTOMER_REQUESTS_TABLE = "customer_requests";

console.log("Loaded clientEnquiries route using table:", CUSTOMER_REQUESTS_TABLE);

router.get(["/client-enquiries", "/customer-requests"], async (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        full_name,
        phone,
        email,
        support_type,
        description,
        created_at
      FROM ${CUSTOMER_REQUESTS_TABLE}
      ORDER BY created_at DESC
    `;
    console.log("Executing SQL for customer-requests:", sql);
    const [rows] = await pool.query(sql);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.put(["/client-enquiries/:id", "/customer-requests/:id"], (req, res) => {
  const { full_name, phone, email, support_type } = req.body;
  const sql = `UPDATE ${CUSTOMER_REQUESTS_TABLE} SET full_name=?, phone=?, email=?, support_type=? WHERE id=?`;

  pool.query(
    sql,
    [full_name, phone, email, support_type, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        message: "Updated Successfully",
      });
    }
  );
});

router.delete(["/client-enquiries/:id", "/customer-requests/:id"], (req, res) => {
  const sql = `DELETE FROM ${CUSTOMER_REQUESTS_TABLE} WHERE id=?`;

  pool.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({
      success: true,
      message: "Deleted Successfully",
    });
  });
});

router.get(["/client-enquiries/date/:date", "/customer-requests/date/:date"], (req, res) => {
  const sql = `
    SELECT *
    FROM ${CUSTOMER_REQUESTS_TABLE}
    WHERE DATE(created_at)=?
  `;

  pool.query(sql, [req.params.date], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

router.get(["/client-enquiries/month/:month", "/customer-requests/month/:month"], (req, res) => {
  const sql = `
    SELECT *
    FROM ${CUSTOMER_REQUESTS_TABLE}
    WHERE DATE_FORMAT(created_at,'%Y-%m')=?
  `;

  pool.query(sql, [req.params.month], (err, rows) => {
    if (err) return res.status(500).json(err);

    res.json(rows);
  });
});

// Batches Routes
router.get("/batches", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM batches ORDER BY id DESC"
    );
    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

router.post("/batches", async (req, res) => {
  try {
    const {
      course_name,
      trainer_name,
      start_date,
      end_date,
    } = req.body;

    const sql = `
      INSERT INTO batches
      (course_name, trainer_name, start_date, end_date)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      course_name,
      trainer_name,
      start_date,
      end_date,
    ]);

    res.status(201).json({
      success: true,
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;