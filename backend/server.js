const express = require("express");
const cors = require("cors");
require("dotenv").config();
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
  "/api",
  require("./routes/clientEnquiries")
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