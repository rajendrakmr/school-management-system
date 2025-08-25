require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const verifyToken = require('./src/middlewares/authMiddleware'); // your token middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads/logos", express.static("uploads/logos"));
app.use("/uploads/academics", express.static("uploads/academics"));
// Database sync
sequelize.sync({ alter: true })
  .then(() => {
    console.log('DB Synced');

    app.get('/health', (req, res) => res.status(200).send('OK')); // liveness
    app.get('/ready', async (req, res) => { // readiness
      try {
        await sequelize.authenticate(); // check DB connection
        res.status(200).send('READY');
      } catch (err) { 
        res.status(500).send('NOT READY');
      }
    });
    app.get('/api/v1', (req, res) => res.send('Welcome to ERP SaaS School Management backend service...'));
    app.use('/api/v1/auth', require('./src/routes/authRoutes')); // login, register, forgot password
    app.use('/api/v1/users', verifyToken, require('./src/routes/userRoutes'));
   
    app.use('/api/v1/', verifyToken, require('./src/routes/academicRoutes'));
    app.use('/api/v1/roles', verifyToken, require('./src/routes/rbacRoutes'));
    app.use('/api/v1/columns', verifyToken, require('./src/routes/columnRoutes'));
    app.use('/api/v1/schools', verifyToken, require('./src/routes/schoolRoutes'));
    app.use('/api/v1/permissions', verifyToken, require('./src/routes/permissionRoutes'));
    app.use('/api/v1/modules', verifyToken, require('./src/routes/moduleRoutes'));
    app.post("/api/v1/auth/logout", verifyToken, (req, res) => {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
      });
      res.json({ message: "Logged out" });
    });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('DB sync error:', err));
