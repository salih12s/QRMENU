const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcı bilgilerini veritabanından al
    const result = await pool.query(
      'SELECT id, username, email, role, restaurant_id FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};

const requireRestaurantAdmin = (req, res, next) => {
  if (req.user.role !== 'restaurant_admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Restaurant admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireSuperAdmin,
  requireRestaurantAdmin
};