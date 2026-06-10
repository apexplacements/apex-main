const express = require("express");
const router = express.Router();
const pool = require("../clientdb");

const CUSTOMER_REQUESTS_TABLE = "customer_requests";

console.log("Loaded clientEnquiries route using table:", CUSTOMER_REQUESTS_TABLE);

const createCustomerRequest = async (req, res) => {
  try {
    const { full_name, phone, email, support_type, description } = req.body;

    // Validate required fields
    if (!full_name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone, and Email are required"
      });
    }

    const sql = `
      INSERT INTO ${CUSTOMER_REQUESTS_TABLE} 
      (full_name, phone, email, support_type, description, created_at) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.query(sql, [
      full_name,
      phone,
      email,
      support_type || null,
      description || null
    ]);

    res.json({
      success: true,
      message: "Request submitted successfully!",
      id: result.insertId
    });
  } catch (err) {
    console.error("Error creating customer request:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Failed to submit request"
    });
  }
};

router.post("/client-enquiries", createCustomerRequest);
router.post("/customer-requests", createCustomerRequest);
router.post("/customerrequest", createCustomerRequest);


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

// Support updating and deleting batches here as well to avoid routing order issues
router.put('/batches/:id', async (req, res) => {
  try {
    const { course_name, trainer_name, start_date, end_date } = req.body;
    const sql = `UPDATE batches SET course_name=?, trainer_name=?, start_date=?, end_date=? WHERE id=?`;
    const [result] = await pool.execute(sql, [course_name, trainer_name, start_date, end_date, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[clientEnquiries] PUT /batches/:id error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    const sql = `DELETE FROM batches WHERE id=?`;
    const [result] = await pool.execute(sql, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[clientEnquiries] DELETE /batches/:id error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;