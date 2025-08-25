const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const School = require('./School');
const User = require('./User');
const Medium = require('./Medium');
const Shift = require('./Shift');
const Stream = require('./Stream');
const Section = require('./Section');

const Class = sequelize.define('Class', {
    mst_class_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    trn_school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: School,
            key: 'trn_school_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    mst_medium_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Medium,
            key: 'mst_medium_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    mst_shift_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Shift,
            key: 'mst_shift_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    mst_stream_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Stream,
            key: 'mst_stream_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    mst_section_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Section,
            key: 'mst_section_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    mst_semester_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Section,
            key: 'mst_semester_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false
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
    tableName: 'erp_mst_classes',
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
});

module.exports = Class;
