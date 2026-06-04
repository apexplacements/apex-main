const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const db = require("../config/db");

/* =========================
   REGISTER USER
========================= */

router.post("/", async (req, res) => {
  console.log('register route hit', req.body);

  const {
    name,
    phone,
    email,
    password
  } = req.body;

  try {
    console.log('register request data', { name, phone, email });
    console.log('checking existing user for email', email);
    const [existing] = await db.query(
      "SELECT * FROM registered_users WHERE email = ?",
      [email]
    );

    console.log('existing row count', existing.length);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO registered_users
      (
        name,
        phone,
        email,
        password
      )
      VALUES (?, ?, ?, ?)
    `;

    console.log('inserting new user', email);
    await db.query(sql, [name, phone, email, hashedPassword]);
    console.log('insert complete', email);

    res.status(201).json({
      success: true,
      message: "Registration Successful"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

});

module.exports = router;