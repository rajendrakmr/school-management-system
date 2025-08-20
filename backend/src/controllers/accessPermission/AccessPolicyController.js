const { User, Role, Permission } = require('../models');

exports.validateAssignRole = [
  body("userId")
    .notEmpty().withMessage("userId is required")
    .isInt().withMessage("userId must be an integer"),

  body("roleIds")
    .optional()  
    .isArray().withMessage("roleIds must be an array of integers"),

  body("roleIds.*")
    .optional()
    .isInt().withMessage("Each roleId must be an integer"),
];




exports.assignRolesToUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
      const formattedErrors = {};
      errors.array().forEach(err => {
        formattedErrors[err.param] = err.msg;
      });
      return res.status(400).json({ errors: formattedErrors });
    } 
    const { userId, roleIds } = req.body; 
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ errors: { userId: "User not found" } }); 
    if (Array.isArray(roleIds) && roleIds.length > 0) { 
      const roles = await Role.findAll({ where: { role_id: roleIds } });
      await user.setRoles(roles);
    } else { 
      await user.setRoles([]);
    }

    const updatedUser = await User.findByPk(userId, {
      include: { model: Role, as: "roles" }
    });

    res.json({ message: "Roles updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get user access policy (roles + permissions)
exports.getUserAccessPolicy = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [
            { model: Permission, as: 'permissions', attributes: ['permission_id', 'permission_name', 'path_url'] }
          ]
        }
      ]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Flatten permissions
    const permissions = user.roles.flatMap(role => role.permissions.map(p => p.permission_name));
    const uniquePermissions = [...new Set(permissions)];

    res.json({
      user: user.username,
      roles: user.roles.map(r => r.role_name),
      permissions: uniquePermissions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if user has specific permission
exports.checkUserPermission = async (req, res) => {
  try {
    const { userId, permissionName } = req.body;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [{ model: Permission, as: 'permissions', attributes: ['permission_name'] }]
        }
      ]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const hasPermission = user.roles.some(role =>
      role.permissions.some(p => p.permission_name === permissionName)
    );

    res.json({ user: user.username, permission: permissionName, allowed: hasPermission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
