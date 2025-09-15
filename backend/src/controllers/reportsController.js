const pool = require('../config/database');

const getRestaurantReports = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { startDate, endDate } = req.query;

    // Yetki kontrolü
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 gün önce
    const end = endDate || new Date().toISOString().split('T')[0]; // bugün

    // Genel istatistikler
    const statsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT rv.view_date) as active_days,
        COALESCE(SUM(rv.view_count), 0) as total_views,
        COUNT(DISTINCT mi.id) as total_menu_items,
        COUNT(DISTINCT c.id) as total_categories
      FROM restaurants r
      LEFT JOIN restaurant_views rv ON r.id = rv.restaurant_id AND rv.view_date BETWEEN $2 AND $3
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id AND mi.is_available = true
      LEFT JOIN categories c ON r.id = c.restaurant_id AND c.is_active = true
      WHERE r.id = $1
    `, [restaurantId, start, end]);

    // Günlük görüntülenmeler
    const dailyViewsResult = await pool.query(`
      SELECT 
        view_date,
        SUM(view_count) as views
      FROM restaurant_views
      WHERE restaurant_id = $1 AND view_date BETWEEN $2 AND $3
      GROUP BY view_date
      ORDER BY view_date DESC
      LIMIT 30
    `, [restaurantId, start, end]);

    // Popüler menü öğeleri (görüntülenme sayısına göre)
    const popularItemsResult = await pool.query(`
      SELECT 
        mi.name,
        c.name as category_name,
        mi.price,
        COALESCE(SUM(mv.view_count), 0) as views
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      LEFT JOIN menu_views mv ON mi.id = mv.menu_item_id AND mv.view_date BETWEEN $2 AND $3
      WHERE mi.restaurant_id = $1 AND mi.is_available = true
      GROUP BY mi.id, mi.name, c.name, mi.price
      ORDER BY views DESC
      LIMIT 10
    `, [restaurantId, start, end]);

    // Kategori performansı
    const categoryPerformanceResult = await pool.query(`
      SELECT 
        c.name as category_name,
        COUNT(mi.id) as item_count,
        COALESCE(SUM(mv.view_count), 0) as total_views,
        COALESCE(AVG(mv.view_count), 0) as avg_views_per_item
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id AND mi.is_available = true
      LEFT JOIN menu_views mv ON mi.id = mv.menu_item_id AND mv.view_date BETWEEN $2 AND $3
      WHERE c.restaurant_id = $1 AND c.is_active = true
      GROUP BY c.id, c.name
      ORDER BY total_views DESC
    `, [restaurantId, start, end]);

    res.json({
      stats: statsResult.rows[0],
      dailyViews: dailyViewsResult.rows,
      popularItems: popularItemsResult.rows,
      categoryPerformance: categoryPerformanceResult.rows,
      period: { start, end }
    });
  } catch (error) {
    console.error('Get restaurant reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSuperAdminReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    // Genel sistem istatistikleri
    const systemStatsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT r.id) as total_restaurants,
        COUNT(DISTINCT r.id) FILTER (WHERE r.is_active = true) as active_restaurants,
        COUNT(DISTINCT mi.id) as total_menu_items,
        COUNT(DISTINCT c.id) as total_categories,
        COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'restaurant_admin') as restaurant_admins,
        COALESCE(SUM(rv.view_count), 0) as total_views
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id
      LEFT JOIN categories c ON r.id = c.restaurant_id
      LEFT JOIN users u ON r.id = u.restaurant_id
      LEFT JOIN restaurant_views rv ON r.id = rv.restaurant_id AND rv.view_date BETWEEN $1 AND $2
    `, [start, end]);

    // Restoran performansı
    const restaurantPerformanceResult = await pool.query(`
      SELECT 
        r.id,
        r.name,
        r.is_active,
        COUNT(DISTINCT mi.id) as menu_items_count,
        COUNT(DISTINCT c.id) as categories_count,
        COALESCE(SUM(rv.view_count), 0) as total_views,
        r.created_at
      FROM restaurants r
      LEFT JOIN menu_items mi ON r.id = mi.restaurant_id AND mi.is_available = true
      LEFT JOIN categories c ON r.id = c.restaurant_id AND c.is_active = true
      LEFT JOIN restaurant_views rv ON r.id = rv.restaurant_id AND rv.view_date BETWEEN $1 AND $2
      GROUP BY r.id, r.name, r.is_active, r.created_at
      ORDER BY total_views DESC
    `, [start, end]);

    // Günlük sistem görüntülenmeleri
    const dailySystemViewsResult = await pool.query(`
      SELECT 
        view_date,
        COUNT(DISTINCT restaurant_id) as active_restaurants,
        SUM(view_count) as total_views
      FROM restaurant_views
      WHERE view_date BETWEEN $1 AND $2
      GROUP BY view_date
      ORDER BY view_date DESC
      LIMIT 30
    `, [start, end]);

    // En popüler menü öğeleri (tüm sistem)
    const topMenuItemsResult = await pool.query(`
      SELECT 
        mi.name,
        r.name as restaurant_name,
        c.name as category_name,
        mi.price,
        COALESCE(SUM(mv.view_count), 0) as views
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      JOIN categories c ON mi.category_id = c.id
      LEFT JOIN menu_views mv ON mi.id = mv.menu_item_id AND mv.view_date BETWEEN $1 AND $2
      WHERE mi.is_available = true AND r.is_active = true
      GROUP BY mi.id, mi.name, r.name, c.name, mi.price
      ORDER BY views DESC
      LIMIT 20
    `, [start, end]);

    res.json({
      systemStats: systemStatsResult.rows[0],
      restaurantPerformance: restaurantPerformanceResult.rows,
      dailySystemViews: dailySystemViewsResult.rows,
      topMenuItems: topMenuItemsResult.rows,
      period: { start, end }
    });
  } catch (error) {
    console.error('Get super admin reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRestaurantReports,
  getSuperAdminReports
};