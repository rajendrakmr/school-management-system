const { Op } = require('sequelize');
const TableColumn = require('../models/TableColumn');


// exports.gets = async (req, res) => {
//   try {
//     // fetch data
//     res.json({ success: true, data: [] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// const { Op } = require("sequelize");
// const TableColumn = require("../models/TableColumn");
exports.lists = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const columns = await TableColumn.findAll({
            where: {
                column_key: { [Op.ne]: "page_size" },
                is_default: 1,
            },
            order: [["column_order", "ASC"]],
            attributes: [
                "id",
                "key_type",
                "column_key",
                "column_label",
                "column_order",
                "is_active",
                "is_admin_only",
                "page_size",
            ],
        });

        // default size (agar nahi mila toh 5)
        const size = columns.length > 0 ? (columns[0].page_size || 5) : 5;

        // group by key_type
        const grouped = columns.reduce((acc, col) => {
            if (!acc[col.key_type]) acc[col.key_type] = [];
            acc[col.key_type].push(col);
            return acc;
        }, {});

        const pages = Object.keys(grouped); // unique key_types
        const total = pages.length;
        const totalPages = Math.ceil(total / limit);

        // paginate
        const pagedPages = pages.slice(offset, offset + limit);

        const groupedColumns = pagedPages.map((page) => ({
            page,
            size,
            columns: grouped[page],
        }));

        res.json({
            page,
            limit,
            total,
            totalPages,
            items: groupedColumns,
        });
    } catch (err) {
        console.log("Error in lists:", err);
        res.status(500).json({ error: err.message });
    }
};


exports.gets = async (req, res) => {
    try {
        const { type } = req.query;
        const { trn_user_id, trn_school_id } = req;

        // helper function to build whereClause
        const buildWhereClause = (isDefault = 0, userId = null) => {
            const where = {
                key_type: type,
                is_default: isDefault,
                column_key: { [Op.ne]: "page_size" },
            };

            if (userId) where.user_id = userId;
            where.is_admin_only = trn_school_id ? "N" : { [Op.in]: ["N", "Y"] };

            return where;
        };

        // 1st priority → user-specific columns (is_default = 0)
        let columns = await TableColumn.findAll({
            where: buildWhereClause(0, trn_user_id),
            order: [["column_order", "ASC"]],
            attributes: ["id", "column_key", "column_label", "column_order", "is_active"],
        });
        if (!columns.length) {
            columns = await TableColumn.findAll({
                where: buildWhereClause(1),
                order: [["column_order", "ASC"]],
                attributes: ["id", "column_key", "column_label", "column_order", "is_active"],
            });
        }

        // normalize is_active to boolean
        columns = columns.map((col) => ({
            ...col.toJSON(),
            is_active: col.is_active === "Y" || col.is_active === true,
        }));
        let pageSizeValue = 12;
        const pageSizeRecord = await TableColumn.findOne({
            where: { key_type: type, column_key: "page_size", is_default: 1 },
            attributes: ["page_size"],
        });

        if (pageSizeRecord) pageSizeValue = pageSizeRecord.page_size;

        res.json({ page_size: pageSizeValue, columns });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// PUT: update multiple columns
exports.saveUpdateRecord = async (req, res) => {
    try {
        const { columns, name, size } = req.body;

        // 🔹 validations
        if (!name) {
            return res.status(422).json({
                errors: { name: "key_type (page name) is required." }
            });
        }

        if (!columns || !Array.isArray(columns) || columns.length === 0) {
            return res.status(422).json({
                errors: { columns: "At least one row mandatory field is required." }
            });
        }

        // 🔹 delete existing records for this page
        await TableColumn.destroy({ where: { key_type: name } }); 
        const defaultPageSize = size || 10; 
        const insertData = columns.map((col, index) => ({
            key_type: name,
            column_key: col.column_key,
            column_label: col.column_label,
            column_order: col.column_order || index + 1,
            user_id: null,
            is_default: 1,
            page_size: defaultPageSize,
            is_admin_only: col.is_admin_only || "Y",
            is_active: col.is_active || "Y"
        }));
 
        insertData.push({
            key_type: name,
            column_key: "page_size",
            column_label: "Page Size",
            column_order: columns.length + 1,
            user_id: null,
            is_default: 1,
            page_size: defaultPageSize,
            is_admin_only: "Y",
            is_active: "Y"
        });

        // 🔹 bulk insert all records at once
        await TableColumn.bulkCreate(insertData);

        res.json({ message: "Columns replaced successfully." });
    } catch (err) {
        console.error("Error in saveUpdateRecord:", err);
        res.status(500).json({ error: err.message });
    }
};







// POST: create new column
exports.create = async (req, res) => {
    try {
        const { key_type, column_key, column_label, column_order, is_active } = req.body;
        const newColumn = await TableColumn.create({
            key_type,
            column_key,
            column_label,
            column_order,
            is_active: is_active || 'Y',
        });

        res.status(201).json({ message: 'Column created', column: newColumn });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// PUT: update multiple columns
exports.update = async (req, res) => {
    try {
        const { selectedColumns, user_id, type = "roles", page_size } = req.body; // key_type optional, default 'roles'

        if (!selectedColumns || !Array.isArray(selectedColumns)) {
            return res.status(400).json({ error: "selectedColumns array is required." });
        }

        // Loop through each column
        const updatedColumns = [];
        for (const col of selectedColumns) {
            const { column_key, column_label, column_order, is_active } = col;
            const activeValue = is_active === true ? "Y" : is_active === false ? "N" : is_active || "Y";
            const column = await TableColumn.findOne({ where: { key_type: type, column_key, user_id } });

            if (!column) {
                const newColumn = await TableColumn.create({
                    key_type: type,
                    column_key,
                    column_label,
                    column_order,
                    user_id,
                    is_default: 0,
                    is_active: activeValue,
                });
                updatedColumns.push(newColumn);
            } else {
                // Update existing
                column.column_label = column_label || column.column_label;
                column.column_order = column_order || column.column_order;
                column.is_active = activeValue;
                column.is_default = 0;
                await column.save();
                updatedColumns.push(column);
            }
        }

        // Update page_size column separately
        if (page_size) {
            const pageSizeColumn = await TableColumn.findOne({
                where: { key_type: type, column_key: "page_size", user_id }
            });
            if (!pageSizeColumn) {
                await TableColumn.create({
                    key_type: type,
                    column_key: "page_size",
                    column_label: "Page Size",
                    column_order: selectedColumns.length + 1,
                    user_id,
                    is_default: 0,
                    is_active: "Y",
                    page_size
                });
            } else {
                pageSizeColumn.page_size = page_size;
                await pageSizeColumn.save();
            }
        }

        res.json({ message: "Columns updated successfully.", updatedColumns });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// // DELETE: remove column
// exports.delete = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const column = await TableColumn.findByPk(id);
//         if (!column) return res.status(404).json({ error: 'Column not found' });

//         await column.destroy();
//         res.json({ message: 'Column deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
