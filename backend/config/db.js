const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");

const dotenvResult = dotenv.config({ path: path.join(__dirname, "..", ".env") });
if (dotenvResult.error) {
  console.warn("Warning: backend/.env file not found or could not be loaded in backend/config/db.js");
}

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbUser = process.env.DB_USER || "root";
const dbName = process.env.DB_NAME || "";

if (!process.env.DB_HOST) {
  console.warn(
    "Warning: DB_HOST is not set. Defaulting to 127.0.0.1 which may cause ECONNREFUSED if MySQL is not running locally."
  );
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false
        }
      : false
});

module.exports = db.promise();