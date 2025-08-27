const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ModuleModel = sequelize.define('ModuleModel', {
    mst_module_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    module_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    has_child: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y'
    },
    font_icon: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    is_active: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y'
    }
}, {
    tableName: 'erp_mst_modules',
    timestamps: false
});

module.exports = ModuleModel;
