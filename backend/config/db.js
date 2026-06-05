const mysql = require("mysql2");
const { loadEnv } = require("./env");

loadEnv();

const dbHost = process.env.DB_HOST || process.env.RDS_HOSTNAME || "127.0.0.1";
const dbPort = Number(process.env.DB_PORT || process.env.RDS_PORT || 3306);
const dbUser = process.env.DB_USER || process.env.RDS_USERNAME || process.env.RDS_USER || "root";
const dbName = process.env.DB_NAME || process.env.RDS_DB_NAME || process.env.RDS_DATABASE || "";
const dbPassword = process.env.DB_PASSWORD || process.env.RDS_PASSWORD || "";

if (!process.env.DB_HOST && !process.env.RDS_HOSTNAME && !process.env.RDS_PORT) {
  console.warn(
    "Warning: DB_HOST and RDS_HOSTNAME are not set. Defaulting to 127.0.0.1 which may cause ECONNREFUSED if MySQL is not running locally."
  );
}

const db = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONN_LIMIT) || 10,
  queueLimit: 0,
  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

module.exports = db.promise();