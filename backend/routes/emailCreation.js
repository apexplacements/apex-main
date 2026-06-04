const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { sendAdminCredentials } = require("../config/email");

const ROLE_ABBREV = {
  admin: "admin",
  hr: "hr",
  trainer: "tr",
  student: "std",
  placementofficer: "po",
  "placement officer": "po",
  placement: "po",
};

const ROLE_DEFAULT_PASSWORD = {
  admin: "admin@123",
  hr: "hr@123",
  trainer: "tr@123",
  student: "std@123",
  placementofficer: "po@123",
  "placement officer": "po@123",
  placement: "po@123",
};

const normalizeNameKey = (name) => {
  const parts = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "";
  const firstName = parts[0];
  const initials = parts.slice(1).map((part) => part[0]).join("");
  return `${firstName}${initials}`;
};

const normalizeRoleKey = (role) => {
  const normalized = role.trim().toLowerCase();
  return ROLE_ABBREV[normalized] || normalized.slice(0, 3);
};

const getDefaultPassword = (role) => {
  const normalized = role.trim().toLowerCase();
  return ROLE_DEFAULT_PASSWORD[normalized] || `${normalizeRoleKey(role)}@123`;
};

const generateEmailAddresses = (name, roles) => {
  const userKey = normalizeNameKey(name);
  return roles.map((role) => {
    const roleKey = normalizeRoleKey(role);
    return {
      role,
      email: `${userKey}.${roleKey}@apexplacements.in`,
      default_password: getDefaultPassword(role),
    };
  });
};

const initializeTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS generated_emails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      role VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      default_password VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      password_reset_required BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [columns] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'generated_emails'
       AND COLUMN_NAME = 'default_password'`
  );

  if (!columns.length) {
    await db.query(
      `ALTER TABLE generated_emails
       ADD COLUMN default_password VARCHAR(255) NOT NULL DEFAULT ''`
    );
  }

  await db.query(`
    UPDATE generated_emails
    SET default_password = CASE
      WHEN role = 'admin' THEN 'admin@123'
      WHEN role = 'hr' THEN 'hr@123'
      WHEN role = 'trainer' THEN 'tr@123'
      WHEN role = 'student' THEN 'std@123'
      WHEN role IN ('placementofficer', 'placement officer', 'placement') THEN 'po@123'
      ELSE CONCAT(LEFT(role, 3), '@123')
    END
    WHERE default_password = '' OR default_password IS NULL
  `);

  const [pwResetCol] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'generated_emails'
       AND COLUMN_NAME = 'password_reset_required'`
  );

  if (!pwResetCol.length) {
    await db.query(
      `ALTER TABLE generated_emails
       ADD COLUMN password_reset_required BOOLEAN DEFAULT TRUE`
    );
  }

  const [passwordCol] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'generated_emails'
       AND COLUMN_NAME = 'password'`
  );

  if (!passwordCol.length) {
    await db.query(
      `ALTER TABLE generated_emails
       ADD COLUMN password VARCHAR(255)`
    );
  }
};

initializeTable().catch((err) => {
  console.error("Failed to initialize generated_emails table:", err);
});

router.get("/users", async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM registered_users ORDER BY name ASC"
    );

    res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load registered users",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, user_id, user_name, role, email, default_password, password, password_reset_required, created_at FROM generated_emails ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load generated emails",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID is required to delete a generated email entry",
    });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM generated_emails WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Generated email entry not found",
      });
    }

    res.json({
      success: true,
      message: "Generated email entry deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete generated email entry",
    });
  }
});

router.post("/", async (req, res) => {
  const { userId, roles } = req.body;

  if (!userId || !Array.isArray(roles) || roles.length === 0) {
    return res.status(400).json({
      success: false,
      message: "userId and roles are required",
    });
  }

  try {
    const [users] = await db.query(
      "SELECT id, name, email FROM registered_users WHERE id = ?",
      [userId]
    );

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "Registered user not found",
      });
    }

    const user = users[0];
    const generated = generateEmailAddresses(user.name, roles);
    const insertValues = generated.map((item) => [
      user.id,
      user.name,
      item.role,
      item.email,
      item.default_password,
    ]);

    if (insertValues.length > 0) {
      await db.query(
        `INSERT INTO generated_emails (user_id, user_name, role, email, default_password) VALUES ?
         ON DUPLICATE KEY UPDATE
           user_id = VALUES(user_id),
           user_name = VALUES(user_name),
           role = VALUES(role),
           default_password = VALUES(default_password)`,
        [insertValues]
      );
    }

    // Send credentials to admin's registered email if admin role is included
    for (const item of generated) {
      if (item.role.toLowerCase() === "admin") {
        await sendAdminCredentials(
          user.email,
          item.email,
          item.default_password,
          user.name
        );
      }
    }

    const [rows] = await db.query(
      `SELECT id, user_id, user_name, role, email, default_password, password, password_reset_required, created_at FROM generated_emails WHERE user_id = ? ORDER BY created_at DESC`,
      [user.id]
    );

    res.json({
      success: true,
      message: "Emails generated successfully. Admin credentials sent to registered email.",
      data: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to generate emails",
    });
  }
});

module.exports = router;
