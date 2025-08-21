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
        let columns = await TableColumn.findAll({
            where: {
                column_key: { [Op.ne]: "page_size" },
                is_default: 1,
            },
            order: [["column_order", "ASC"]],
            attributes: ["id", "key_type", "column_key", "column_label", "column_order", "is_active"],
        });
        const grouped = {};
        columns.forEach((col) => {
            if (!grouped[col.key_type]) {
                grouped[col.key_type] = [];
            }
            grouped[col.key_type].push(col);
        });

        // unique pages
        const pages = Object.keys(grouped);
        const total = pages.length;
        const totalPages = Math.ceil(total / limit);

        // paginate by group
        const pagedPages = pages.slice(offset, offset + limit);

        const groupedColumns = pagedPages.map((page) => ({
            page,
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
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.gets = async (req, res) => {
    try {
        const type = req.query.type;
        const user_id = req.query.user_id ? parseInt(req.query.user_id) : null;
        let columns = [];
        if (user_id) {
            columns = await TableColumn.findAll({
                where: {
                    key_type: type,
                    column_key: { [Op.ne]: 'page_size' },
                    user_id: user_id
                },
                order: [['column_order', 'ASC']],
                attributes: ['id', 'column_key', 'column_label', 'column_order', 'is_active'],
            });
        }
        if (!columns || columns.length === 0) {
            columns = await TableColumn.findAll({
                where: {
                    key_type: type,
                    column_key: { [Op.ne]: 'page_size' },
                    is_default: 1
                },
                order: [['column_order', 'ASC']],
                attributes: ['id', 'column_key', 'column_label', 'column_order', 'is_active'],
            });
        }

        columns = columns.map(col => ({
            ...col.toJSON(),
            is_active: col.is_active === 'Y' || col.is_active === true
        }));

        // page_size fetch
        let pageSizeValue = 12; // default
        let pageSizeRecord = null;

        if (user_id) {
            pageSizeRecord = await TableColumn.findOne({
                where: { key_type: type, column_key: 'page_size', user_id: user_id },
                attributes: ['page_size']
            });
        }

        if (!pageSizeRecord) {
            pageSizeRecord = await TableColumn.findOne({
                where: { key_type: type, column_key: 'page_size', is_default: 1 },
                attributes: ['page_size']
            });
        }

        if (pageSizeRecord) pageSizeValue = pageSizeRecord.page_size;

        res.json({ page_size: pageSizeValue, columns });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};



// PUT: update multiple columns
exports.saveUpdateRecord = async (req, res) => {
    try {
        const selectedColumns = req.body;

        if (!selectedColumns || !Array.isArray(selectedColumns)) {
            return res.status(400).json({ error: "selectedColumns array is required." });
        } 
        for (const col of selectedColumns) {
            const { column_key, column_label,key_type, column_order, is_active, page_size } = col;
            const pageSize = page_size?page_size:10;
            let column = await TableColumn.findOne({ where: { key_type, column_key, is_default: 1 } });
            if (!column) {
                column = await TableColumn.create({
                    key_type,
                    column_key,
                    column_label,
                    column_order,
                    user_id: null,
                    is_default: 1,
                    page_size:pageSize,
                    is_active
                });
            } else {
                await TableColumn.update(
                    {
                        key_type,
                        column_label,
                        column_order,
                        user_id: null,
                        is_default: 1,
                        page_size:pageSize,
                        is_active
                    },
                    {
                        where: {
                            is_default: 1,
                            key_type,
                            column_key,
                        }
                    }
                );

                await TableColumn.update(
                    {
                        key_type,
                        column_label,
                        column_order,
                        user_id: null,
                        is_default: 1,
                        page_size:pageSize,
                        is_active
                    },
                    {
                        where: {
                            is_default: 0,
                            key_type,
                            column_key,
                        }
                    }
                ); 
            } 
        } 
        res.json({ message: "Columns updated successfully." });
    } catch (err) { 
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
            const column = await TableColumn.findOne({ where: { key_type:type, column_key, user_id } });

            if (!column) {
                const newColumn = await TableColumn.create({
                    key_type:type,
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
                where: { key_type:type, column_key: "page_size", user_id }
            });
            if (!pageSizeColumn) {
                await TableColumn.create({
                    key_type:type,
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
