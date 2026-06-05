const db = require("./config/db");

(async () => {
  try {
    const [insertResult] = await db.query(
      "INSERT INTO students (name, mobile, email, course, batch, status) VALUES (?, ?, ?, ?, ?, ?)",
      ["Test Student", "9999999999", "teststudent@example.com", "Test Course", "Batch A", "Active"]
    );
    console.log("Inserted test student id:", insertResult.insertId);

    const [rows] = await db.query("SELECT * FROM students WHERE id = ?", [insertResult.insertId]);
    console.log("Retrieved student:", rows[0]);

    await db.query("DELETE FROM students WHERE id = ?", [insertResult.insertId]);
    console.log("Deleted test student successfully");
    process.exit(0);
  } catch (err) {
    console.error("CRUD smoke test failed:", err);
    process.exit(1);
  }
})();
