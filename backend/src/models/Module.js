const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Module = sequelize.define('Module', {
    mst_module_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    module_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    has_child: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y'
    },
    is_active: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y'
    }
}, {
    tableName: 'erp_mst_modules',
    timestamps: false
});

module.exports = Module;
