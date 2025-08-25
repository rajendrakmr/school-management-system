const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
 
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!req.body) req.body = {};
    if (decoded.trn_school_id) {
      req.body.trn_school_id = decoded.trn_school_id
    }
    const user = await User.findOne({
      where: { trn_user_id: decoded.trn_user_id },
      attributes: ['trn_user_id', 'trn_school_id', 'password_hash', 'email']
    }); 
    if (!user) return res.status(401).json({ error: 'User not found' });

    if (decoded.password_hash !== user.password_hash) {
      return res.status(401).json({ error: 'Token invalid due to password change' });
    }

    // Attach user info
    req.user = user;
    req.trn_user_id = user.trn_user_id;
    req.created_by = user.trn_user_id;
    req.updated_by = user.trn_user_id;
    req.trn_school_id = user?.trn_school_id || null;
    req.tenant = user?.trn_school_id || null;
    if (!req.body) req.body = {};
    if (!req.body.trn_school_id) {
      req.body.trn_school_id = user?.trn_school_id
    } 
    req.email = user.email;

    next();
  } catch (err) {
    console.log("errerrerrerrerrerr", err)
    return res.status(401).json({ error: 'Token is not valid' });
  }
};


module.exports = verifyToken;
