const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const School = require('./School');
const User = require('./User');
const Medium = require('./Medium');
const Shift = require('./Shift');
const Stream = require('./Stream');
const Section = require('./Section');

const ClassSection = sequelize.define('ClassSection', {
    mst_class_section_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    trn_school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //     model: School,
        //     key: 'trn_school_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
    },
    mst_section_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //     model: Section,
        //     key: 'mst_section_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
    },
    mst_class_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //     model: Class,
        //     key: 'mst_class_id'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
    },
     
    is_active: {
        type: DataTypes.ENUM('Y', 'N'),
        defaultValue: 'Y'
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'trn_user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'mst_class_sections',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
});

module.exports = ClassSection;
