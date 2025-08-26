const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserHasRole = require("../models/UserHasRole");
const Role = require("../models/Role");
require("dotenv").config();

// Helper for JWT
const generateTokens = (user) => {
  const payload = {
    trn_user_id: user.trn_user_id,
    trn_school_id: user?.trn_school_id || null,
    pwdVersion: user.password_hash.slice(0, 10), // ✅ fingerprint
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
        .json({ errors: { email: `${email} is already taken.` } });
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

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(422)
        .json({ errors: { email: "Email not registered" } });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(422)
        .json({ errors: { password: "Invalid password" } });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store tokens in cookies
    res.cookie("authToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Remove sensitive
    const userObj = user.toJSON();
    delete userObj.password_hash;

    res.json({ message: "Login successful", user: userObj });
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
      secure: process.env.NODE_ENV === "production",
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
      return res.status(422).json({ errors: { oldPassword: "Old password incorrect" } });
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
