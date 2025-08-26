require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const verifyToken = require('./src/middlewares/authMiddleware'); // JWT middleware

const app = express();
const PORT = process.env.PORT || 5000;

 
app.use(
  cors({
    origin: [
      "http://54.74.96.148", 
      "http://localhost:5173" // dev frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 👈 allow cookies
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use("/uploads/logos", express.static("uploads/logos"));
app.use("/uploads/academics", express.static("uploads/academics"));

// ✅ Database sync
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ DB Synced");

    // --- Health & Readiness ---
    app.get("/health", (req, res) => res.status(200).send("OK")); 
    app.get("/ready", async (req, res) => {
      try {
        await sequelize.authenticate();
        res.status(200).send("READY");
      } catch (err) {
        res.status(500).send("NOT READY");
      }
    });

    // --- Public Routes ---
    app.get("/api/v1", (req, res) =>
      res.send("Welcome to ERP SaaS School Management backend service...")
    );
    app.use("/api/v1/auth", require("./src/routes/authRoutes")); // signup, login, refresh

    // --- Protected Routes ---
    app.use("/api/v1/users", verifyToken, require("./src/routes/userRoutes"));
    app.use("/api/v1/", verifyToken, require("./src/routes/academicRoutes"));
    app.use("/api/v1/roles", verifyToken, require("./src/routes/rbacRoutes"));
    app.use("/api/v1/columns", verifyToken, require("./src/routes/columnRoutes"));
    app.use("/api/v1/schools", verifyToken, require("./src/routes/schoolRoutes"));
    app.use("/api/v1/permissions", verifyToken, require("./src/routes/permissionRoutes"));
    app.use("/api/v1/modules", verifyToken, require("./src/routes/moduleRoutes"));

    // --- Logout Route ---
    app.post("/api/v1/auth/logout", verifyToken, (req, res) => {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      });
      return res.json({ message: "Logged out successfully" });
    });

    // ✅ Start server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("❌ DB sync error:", err));
