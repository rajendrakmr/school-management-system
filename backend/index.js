require('dotenv').config();
const express = require('express');
const sequelize = require('./src/config/db'); 
const cors = require('cors');
const app = express();

// Allow requests from frontend
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use("/uploads/logos", express.static("uploads/logos"));
sequelize.sync({ alter: true })

.then(() => {
  console.log('DB Synced'); 
    app.get('/health', (req, res) => { res.status(200).send('OK');});
    app.get('/api/v1', (req, res) => res.send('Welcome to erp saas school management backend service...'));
    app.use('/api/v1/auth', require('./src/routes/authRoutes'));
    app.use('/api/v1/roles', require('./src/routes/rbacRoutes'));
    app.use('/api/v1/columns', require('./src/routes/columnRoutes'));
    app.use('/api/v1/schools', require('./src/routes/schoolRoutes'));
    app.use('/api/v1/permissions', require('./src/routes/permissionRoutes'));
    app.use('/api/v1/modules', require('./src/routes/moduleRoutes'));
    app.use('/api/v1/mediums', require('./src/routes/academics/mediumRoutes'));


    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('DB sync error:', err));
