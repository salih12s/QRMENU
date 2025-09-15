const pool = require('../config/database');
const QRCode = require('qrcode');

const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, 
        COUNT(mi.id) as menu_items_count,
        COUNT(rv.id) as total_views
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
      LEFT JOIN restaurant_views rv ON r.id = rv.restaurant_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `);

    res.json({ restaurants: result.rows });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Eğer restaurant admin ise sadece kendi restoranını görebilir
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(`
      SELECT r.*, 
        COUNT(mi.id) as menu_items_count,
        COUNT(rv.id) as total_views
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
      LEFT JOIN restaurant_views rv ON r.id = rv.restaurant_id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ restaurant: result.rows[0] });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Restaurant name required' });
    }

    // Unique QR code oluştur
    const qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await pool.query(
      'INSERT INTO restaurants (name, description, address, phone, email, qr_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, address, phone, email, qrCode]
    );

    const restaurant = result.rows[0];

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, address, phone, email, is_active } = req.body;

    // Eğer restaurant admin ise sadece kendi restoranını güncelleyebilir
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      'UPDATE restaurants SET name = $1, description = $2, address = $3, phone = $4, email = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, address, phone, email, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      message: 'Restaurant updated successfully',
      restaurant: result.rows[0]
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateQRCode = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    
    if (restaurant.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/menu/${restaurant.rows[0].qr_code}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(menuUrl);

    res.json({
      qrCode: qrCodeDataURL,
      menuUrl: menuUrl
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  generateQRCode
};