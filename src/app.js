const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const logRoutes = require("./routes/log.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/logs", logRoutes);

// Root REST Endpoint Info
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "RBAC OTP Backend REST API is running. The React/Next.js dashboard is served on port 3000.",
  });
});

// Centralized 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `API Route Not Found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;