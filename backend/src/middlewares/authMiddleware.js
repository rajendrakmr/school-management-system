const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { trn_user_id: decoded.trn_user_id },
      attributes: ["trn_user_id", "trn_school_id", "password_hash", "email"],
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    // ✅ Check password hash fingerprint
    if (decoded.pwdVersion !== user.password_hash.slice(0, 10)) {
      return res.status(401).json({ error: "Password changed, token invalid" });
    }

    req.user = user;
    req.trn_user_id = user.trn_user_id;
    req.trn_school_id = user?.trn_school_id || null;
    req.email = user.email;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = verifyToken;
