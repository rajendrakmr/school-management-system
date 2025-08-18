const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  // Header format: Bearer <token>
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded info attach kar di request me
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token is not valid' });
  }
};

module.exports = verifyToken;
