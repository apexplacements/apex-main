const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensurePaymentsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      payment_type VARCHAR(100) NOT NULL,
      payer_name VARCHAR(255),
      payee_name VARCHAR(255),
      amount DECIMAL(12,2) NOT NULL,
      currency VARCHAR(20) DEFAULT 'INR',
      category VARCHAR(255),
      reference VARCHAR(255),
      status VARCHAR(100) DEFAULT 'Completed',
      payment_date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

ensurePaymentsTable().catch((err) => {
  console.error("Failed to initialize payments table:", err);
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM payments ORDER BY payment_date DESC, created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch payments." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM payments WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch payment." });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      payment_type,
      payer_name,
      payee_name,
      amount,
      currency,
      category,
      reference,
      status,
      payment_date,
      notes,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO payments (payment_type, payer_name, payee_name, amount, currency, category, reference, status, payment_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payment_type || "Course Fee",
        payer_name || null,
        payee_name || null,
        amount || 0,
        currency || "INR",
        category || null,
        reference || null,
        status || "Completed",
        payment_date || null,
        notes || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create payment." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      payment_type,
      payer_name,
      payee_name,
      amount,
      currency,
      category,
      reference,
      status,
      payment_date,
      notes,
    } = req.body;

    const [result] = await db.query(
      `UPDATE payments SET payment_type = ?, payer_name = ?, payee_name = ?, amount = ?, currency = ?, category = ?, reference = ?, status = ?, payment_date = ?, notes = ? WHERE id = ?`,
      [
        payment_type || "Course Fee",
        payer_name || null,
        payee_name || null,
        amount || 0,
        currency || "INR",
        category || null,
        reference || null,
        status || "Completed",
        payment_date || null,
        notes || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to update payment." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM payments WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Payment not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to delete payment." });
  }
});

module.exports = router;
