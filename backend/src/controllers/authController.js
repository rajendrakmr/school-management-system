const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const UserHasRole = require("../models/UserHasRoleModel");
const PermissionModel = require("../models/PermissionModel");
const ModuleModel = require("../models/ModuleModel");
const { sequelize } = require("../models");
require("dotenv").config();

// ----------------- JWT Helper -----------------
const generateTokens = (user) => {
  const payload = {
    trn_user_id: user.trn_user_id,
    trn_school_id: user?.trn_school_id || null,
    pwdVersion: user.password_hash.slice(0, 10), // ✅ fingerprint for password
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m", // short-lived
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d", // longer-lived
  });

  return { accessToken, refreshToken };
};

// ---------------- SIGNUP ----------------
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, mst_role_id } = req.body;

    const existRes = await User.findOne({ where: { email } });
    if (existRes) {
      return res
        .status(422)
        .json({ errors: [{ field: "email", message: `${email} is already taken.` }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
    });

    if (mst_role_id) {
      await UserHasRole.create({
        mst_role_id,
        trn_user_id: newUser.trn_user_id,
      });
    }

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(422).json({ errors: [{ field: "email", message: "Email not registered" }] });
    } 
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(422).json({ errors: [{ field: "password", message: "Invalid password" }] });
    }

    const trn_user_id = user.trn_user_id;
    const query = `          
      SELECT ur.mst_role_id,
             JSON_ARRAYAGG(rp.mst_permission_id) as permissionID
      FROM   erp_trn_user_has_roles ur 
      JOIN erp_mst_role_has_permissions as rp
           ON rp.mst_role_id = ur.mst_role_id 
      WHERE ur.trn_user_id=:trn_user_id
      GROUP BY ur.mst_role_id;
    `;

    const menu = await sequelize.query(query, {
      replacements: { trn_user_id },
      type: sequelize.QueryTypes.SELECT,
    });

    const permissionID = menu.length > 0 ? menu[0]?.permissionID : [];

    const modules = await ModuleModel.findAll({
      attributes: ["module_name", "has_child"],
      order: [["mst_module_id", "ASC"]],
      include: [
        {
          model: PermissionModel,
          as: "permissions",
          attributes: ["permission_name", "path_url"],
          where: { mst_permission_id: permissionID },
          required: true,
          order: [["permissions.mst_permission_id", "ASC"]],
        },
      ],
    });

    const nav = modules.map((mod) => {
      if (mod.has_child === "Y" && mod.permissions.length > 0) {
        return {
          name: mod.module_name,
          path: `/${mod.module_name.toLowerCase().replace(/\s+/g, "-")}`,
          icon: null,
          children: mod.permissions.map((p) => ({
            name: p.permission_name,
            path: p.path_url,
          })),
        };
      } else {
        return {
          name: mod.module_name,
          path: mod.permissions[0]?.path_url || "/",
          icon: null,
          isParent: true,
        };
      }
    });

    const currentUrl = `${req.protocol}://${req.get("host")}`;
    const userObj = user.toJSON ? user.toJSON() : { ...user }; 
    userObj.logo = `${currentUrl}/uploads/logos/logo.png`; 
    delete userObj.password_hash;

    const { accessToken, refreshToken } = generateTokens(user); 
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: userObj,
      menu:nav,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- REFRESH TOKEN ----------------
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET); 
    const user = await User.findOne({ where: { trn_user_id: decoded.trn_user_id } });
    if (!user) return res.status(401).json({ error: "User not found" });

    // ✅ Check password version
    if (decoded.pwdVersion !== user.password_hash.slice(0, 10)) {
      return res.status(401).json({ error: "Password changed, login again" });
    }

    const { accessToken } = generateTokens(user);

    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

// ---------------- CHANGE PASSWORD ----------------
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ where: { trn_user_id: req.trn_user_id } });

    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return res.status(422).json({ errors: [{ field: "oldPassword", message: "Old password incorrect" }] });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();

    // ✅ Invalidate old tokens
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Password changed successfully. Please login again." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
