const { Op, Model } = require('sequelize');
 
const { body, validationResult } = require('express-validator');
const { Module, Permission } = require('../models');

// Validation rules for permission creation
 
// Get all permissions with pagination

exports.getAllModules = async (req, res) => {
    try { 
        const { count, rows } = await Module.findAndCountAll({
            attributes: [
                ['mst_module_id', 'value'],        // alias mst_module_id as id
                ['module_name', 'label'],  
            ],
            order: [['mst_module_id', 'ASC']]}); 
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// const { Module, Permission } = require('../models');

// const modulesWithPermissions = await Module.findAll({
//   include: [{ model: Permission, as: 'permissions' }]
// });


exports.getAllPermissionsTree = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',  // make sure association alias matches
          attributes: ['mst_permission_id', 'permission_name', 'path_url']
        }
      ],
      order: [
        ['mst_module_id', 'ASC'],
        [{ model: Permission, as: 'permissions' }, 'mst_permission_id', 'ASC']
      ]
    });

    // Transform into tree nodes
    const nodes = modules
  .map((mod) => {
    if (mod.permissions && mod.permissions.length > 0) {
      return {
        value: mod.module_name
          ? mod.module_name.toLowerCase().replace(/\s+/g, "-")
          : null, // if missing, set null
        label: mod.module_name || "Unnamed Module",
        children: mod.permissions
          .filter((p) => p.mst_permission_id) // ✅ skip empty values
          .map((p) => ({
            value: p.mst_permission_id,
            label: p.permission_name || "Unnamed Permission",
          })),
      };
    } else if (mod.mst_permission_id) {
      // ✅ only return if it has a valid value
      return {
        value: mod.mst_permission_id,
        label: mod.module_name || "Unnamed Module",
      };
    }
    return null; // ❌ don't include if value missing
  })
  .filter(Boolean); // ✅ remove nulls

    // const nodes = modules.map(mod => {
    //   if (mod.permissions && mod.permissions.length > 0) {
    //     return {
    //       value: mod.module_name.toLowerCase().replace(/\s+/g, '-'),
    //       label: mod.module_name,
    //       children: mod.permissions.map(p => ({
    //         value: p.mst_permission_id,
    //         label: p.permission_name
    //       }))
    //     };
    //   } else {
        
    //     return {
    //       value: mod.mst_permission_id,
    //       label: mod.module_name
    //     };
    //   }
    // });

    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


 
// const Permission = require('../models/Permission');

// const { Permission, Module } = require('../models/associations');
// const { validationResult } = require('express-validator');

exports.getMenuNav = async (req, res) => {
  try {
    const modules = await Module.findAll({
      attributes: ['module_name', 'has_child'],
      order: [['mst_module_id', 'ASC']],
      include: [{
        model: Permission,
        as: 'permissions',
        attributes: ['permission_name', 'path_url']
      }]
    });

    // Transform DB data into NavItem format
    const nav = modules.map(mod => {
      if (mod.has_child === 'Y' && mod.permissions.length > 0) {
        // Module with children
        return {
          name: mod.module_name,
          path: `/${mod.module_name.toLowerCase().replace(/\s+/g, '-')}`, // optional path
          icon: null, // you can add icons dynamically if you want
          children: mod.permissions.map(p => ({
            name: p.permission_name,
            path: p.path_url
          }))
        };
      } else {
        // Single module without children
        return {
          name: mod.module_name,
          path: mod.permissions[0]?.path_url || '/', // fallback to '/' if no permission path
          icon: null, // optional
          isParent: true
        };
      }
    });

    res.json(nav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    const rows = await Module.findAll({
      attributes: ['mst_module_id', 'module_name'], // only these fields
      order: [['mst_module_id', 'ASC']],
      include: [{
        model: Permission,
        as: 'permissions',
        attributes: ['mst_permission_id', 'permission_name','path_url',] // only these fields
      }]
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
