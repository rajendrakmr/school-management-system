const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, dialect: 'mysql', logging: false,
    pool: {
      max: 10,         // maximum number of connections in pool
      min: 0,          // minimum number of connections
      acquire: 30000,  // maximum time (ms) to get connection before throwing error
      idle: 10000      // maximum time (ms) a connection can be idle before being released
    }

  }
);

module.exports = sequelize;
