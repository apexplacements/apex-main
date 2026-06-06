const express = require("express");
const cors = require("cors");
const path = require("path");
const { loadEnv } = require("./config/env");

loadEnv();

const register = require("./routes/register");

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy does not allow access from origin ${origin}`));
      }
    },
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Registration Route
app.use("/api/register", register);

//Login Route
app.use("/api/login", require("./routes/login"));

app.use(
  "/api/userrequests",
  require("./routes/userRequests")
);

app.use(
  "/api/batches",
  require("./routes/batches")
);

app.use(
  "/api/courses",
  require("./routes/courses")
);

app.use(
  "/api/trainers",
  require("./routes/trainers")
);

app.use(
  "/api/upload-resource",
  require("./routes/uploadResources")
);

app.use(
  "/api/email-creation",
  require("./routes/emailCreation")
);

app.use(
  "/api/identity-management",
  require("./routes/identityManagement")
);

app.use(
  "/api/students",
  require("./routes/students")
);

app.use(
  "/api/placement-drives",
  require("./routes/placementDrives")
);

app.use(
  "/api/jobs",
  require("./routes/jobs")
);

app.use(
  "/api/companies",
  require("./routes/companies")
);

app.use(
  "/api/interviews",
  require("./routes/interviews")
);

app.use(
  "/api/placements",
  require("./routes/placements")
);

app.use(
  "/api/notifications",
  require("./routes/notifications")
);

app.use(
  "/api/resumes",
  require("./routes/resumes")
);

app.use(
  "/api/payments",
  require("./routes/payments")
);

app.use(
  "/api",
  require("./routes/clientEnquiries")
);

// ============================================
// LMS ROUTES - TRAINER & STUDENT
// ============================================
app.use(
  "/api/lms/trainer",
  require("./routes/trainerRoutes")
);

app.use(
  "/api/lms/student",
  require("./routes/studentRoutes")
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});