const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

const ROLE_MAP = {
  admin: "admin",
  hr: "hr",
  trainer: "tr",
  student: "std",
  placementofficer: "po",
  "placement officer": "po",
  placement: "po",
};

// Debug endpoint to inspect which DB rows the server can see for an email
router.get('/debug/registered', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ success: false, message: 'email query required' });

  try {
    const [registeredRows] = await db.query(
      "SELECT id, name, email, password FROM registered_users WHERE email = ? LIMIT 1",
      [email]
    );

    const [generatedRows] = await db.query(
      "SELECT id, user_id, user_name, role, email, default_password, password FROM generated_emails WHERE email = ? LIMIT 1",
      [email]
    );

    res.json({ success: true, email, registered: registeredRows, generated: generatedRows });
  } catch (err) {
    console.error('debug route error', err);
    res.status(500).json({ success: false, message: 'debug failed' });
  }
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    console.log(`login route: received email=${email}`);

    const [generatedRows] = await db.query(
      "SELECT id, user_id, user_name, role, email, default_password, password, password_reset_required FROM generated_emails WHERE email = ? LIMIT 1",
      [email]
    );
    console.log(`login route: generated_emails count=${generatedRows.length}`);

    if (generatedRows.length) {
      const entry = generatedRows[0];
      const entry = generatedRows[0];
      const correctPassword = entry.password || entry.default_password;

      if (correctPassword !== password) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // Normalize role values to the short codes used by the frontend.
      // Be forgiving: if backend stores variants like 'placementofficer' or 'placement officer'
      // map them to 'po' so frontend routing is consistent.
      const rawRole = (entry.role || "").toString().toLowerCase();
      let normalizedRole = ROLE_MAP[rawRole] || entry.role;
      if (!normalizedRole || normalizedRole === entry.role) {
        if (rawRole.includes("placement")) {
          normalizedRole = "po";
        } else {
          normalizedRole = ROLE_MAP[rawRole] || entry.role;
        }
      }

      return res.json({
        success: true,
        message: "Login successful.",
        data: {
          id: entry.id,
          user_id: entry.user_id,
          user_name: entry.user_name,
          role: normalizedRole,
          email: entry.email,
          password_reset_required: entry.password_reset_required,
        },
      });
    }

    const [registeredRows] = await db.query(
      "SELECT id, name, email, password FROM registered_users WHERE email = ? LIMIT 1",
      [email]
    );
    console.log(`login route: registered_users count=${registeredRows.length}`);

    if (registeredRows.length) {
      const registered = registeredRows[0];
      const passwordMatch = await bcrypt.compare(password, registered.password);

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        data: {
          id: registered.id,
          user_id: registered.id,
          user_name: registered.name,
          role: "registered",
          email: registered.email,
          password_reset_required: false,
          source: "registered_users",
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: "Email not found in the system",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to authenticate",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const { id, newPassword } = req.body;

  if (!id || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "ID and new password are required",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE generated_emails SET password = ?, password_reset_required = FALSE WHERE id = ?",
      [newPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
});

// Reset password by email (forgot password)
router.post("/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE generated_emails SET password = ?, password_reset_required = FALSE WHERE email = ?",
      [newPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

module.exports = router;
