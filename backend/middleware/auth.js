const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Yetkilendirme token\'ı bulunamadı' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Geçersiz veya süresi dolmuş token' 
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu işlem için süper admin yetkisi gerekli' 
    });
  }
  next();
};

const isRestaurantAdmin = (req, res, next) => {
  if (req.user.role !== 'restaurant_admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Bu işlem için restoran admin yetkisi gerekli' 
    });
  }
  next();
};

const checkRestaurantAccess = (req, res, next) => {
  const restaurantId = parseInt(req.params.restaurantId || req.body.restaurant_id);
  
  if (req.user.role === 'super_admin') {
    return next();
  }
  
  if (req.user.role === 'restaurant_admin' && req.user.restaurant_id === restaurantId) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Bu restorana erişim yetkiniz yok' 
  });
};

module.exports = {
  authMiddleware,
  isSuperAdmin,
  isRestaurantAdmin,
  checkRestaurantAccess
};
