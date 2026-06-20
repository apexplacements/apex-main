const express = require("express");
const router = express.Router();
const db = require("../config/db");

const ensureNotificationsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      message TEXT,
      notification_type VARCHAR(100),
      recipients TEXT,
      student_id INT,
      company_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

ensureNotificationsTable().catch((err) => {
  console.error("Failed to initialize notifications table:", err);
});

// Ensure recipients column exists for older DBs
(async () => {
  try {
    await db.query("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipients TEXT");
  } catch (e) {
    // ignore - older MySQL may not support IF NOT EXISTS, or column may already exist
    try {
      await db.query("ALTER TABLE notifications ADD COLUMN recipients TEXT");
    } catch (err) {
      // ignore any error here
    }
  }
})();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT n.*, s.name AS student_name, c.company_name FROM notifications n
       LEFT JOIN students s ON n.student_id = s.id
       LEFT JOIN companies c ON n.company_id = c.id
       ORDER BY n.created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to fetch notifications." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, message, notification_type, student_id, company_id, recipients } = req.body;

    const recipientsValue = Array.isArray(recipients) ? recipients.join(',') : (recipients || null);

    const [result] = await db.query(
      `INSERT INTO notifications (title, message, notification_type, recipients, student_id, company_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title || null,
        message || null,
        notification_type || null,
        recipientsValue,
        student_id || null,
        company_id || null,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Unable to create notification." });
  }
});

module.exports = router;
