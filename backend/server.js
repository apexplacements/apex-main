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
// Debug: log all incoming requests (temporary)
app.use((req, res, next) => {
  try {
    console.log(`INCOMING ${req.method} ${req.path}`);
  } catch (e) {}
  next();
});
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
  "/api/offers",
  require("./routes/offers")
);

app.use(
  "/api/mock-interviews",
  require("./routes/mockInterviews")
);

app.use(
  "/api/placed-students",
  require("./routes/placedStudents")
);

app.use(
  "/api/placement-reports",
  require("./routes/placementReports")
);

app.use(
  "/api/payments",
  require("./routes/payments")
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

// Mount client enquiries after specific API routes so it doesn't shadow them
app.use(
  "/api",
  require("./routes/clientEnquiries")
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
  });
});

// Debug: list registered routes (temporary)
app.get("/debug/routes", (req, res) => {
  try {
    const routes = [];
    const stack = (app._router && app._router.stack) || [];
    stack.forEach((middleware) => {
      if (middleware.route) {
        // routes registered directly on the app
        routes.push(middleware.route.path);
      } else if (middleware.name === "router" && middleware.handle && middleware.handle.stack) {
        middleware.handle.stack.forEach(function (handler) {
          const route = handler.route;
          route && routes.push(route.path ? `${middleware.regexp} -> ${route.path}` : route.path);
        });
      }
    });
    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// Debug: print registered routes to console
  try {
    console.log('Registered app routes:');
    const stack = (app._router && app._router.stack) || [];
    stack.forEach((middleware) => {
      try {
        if (middleware.route) {
          const methods = Object.keys(middleware.route.methods).join(',');
          console.log(`${middleware.route.path} -> [${methods}]`);
        } else if (middleware.name === 'router' && middleware.handle && Array.isArray(middleware.handle.stack)) {
          middleware.handle.stack.forEach(function (handler) {
            try {
              const route = handler.route;
              if (route) {
                const methods = Object.keys(route.methods).join(',');
                console.log(`${route.path} -> [${methods}] (in router ${middleware.regexp})`);
              }
            } catch (innerErr) {
              console.error('Inner route error:', innerErr);
            }
          });
        } else {
          console.log('Middleware:', middleware.name || '<anonymous>', middleware.regexp || '');
        }
      } catch (mwErr) {
        console.error('Middleware iteration error:', mwErr);
      }
    });
  } catch (err) {
    console.error('Error listing routes:', err);
  }

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});