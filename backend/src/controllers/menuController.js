const pool = require('../config/database');

const getMenuByQR = async (req, res) => {
  try {
    const { qrCode } = req.params;
    console.log('Getting menu for QR code:', qrCode);

    // Restoran bilgisini al
    const restaurantResult = await pool.query(
      'SELECT * FROM restaurants WHERE qr_code = $1 AND is_active = true',
      [qrCode]
    );

    console.log('Restaurant query result:', restaurantResult.rows.length);

    if (restaurantResult.rows.length === 0) {
      console.log('Restaurant not found for QR code:', qrCode);
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = restaurantResult.rows[0];
    console.log('Found restaurant:', restaurant.name);

    // Kategorileri ve menü öğelerini al
    const categoriesResult = await pool.query(`
      SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', mi.id,
              'name', mi.name,
              'description', mi.description,
              'price', mi.price,
              'image_url', mi.image_url,
              'allergens', mi.allergens,
              'sort_order', mi.sort_order
            ) ORDER BY mi.sort_order, mi.name
          ) FILTER (WHERE mi.id IS NOT NULL), '[]'
        ) as menu_items
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id AND mi.is_available = true
      WHERE c.restaurant_id = $1 AND c.is_active = true
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `, [restaurant.id]);

    console.log('Categories found:', categoriesResult.rows.length);

    // Görüntülenme sayacını artır (basitleştirilmiş versiyon)
    try {
      const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
      console.log('Client IP:', clientIp);
      
      await pool.query(`
        INSERT INTO restaurant_views (restaurant_id, ip_address, view_date, view_count)
        VALUES ($1, $2, CURRENT_DATE, 1)
        ON CONFLICT (restaurant_id, ip_address, view_date) 
        DO UPDATE SET view_count = restaurant_views.view_count + 1
      `, [restaurant.id, clientIp]);
      
      console.log('View tracking updated');
    } catch (viewError) {
      console.error('View tracking error (non-critical):', viewError);
      // View tracking hatası kritik değil, devam et
    }

    res.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        logo_url: restaurant.logo_url
      },
      categories: categoriesResult.rows
    });
  } catch (error) {
    console.error('Get menu by QR error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Yetki kontrolü
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Kategorileri ve menü öğelerini al
    const categoriesResult = await pool.query(`
      SELECT c.*, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', mi.id,
              'name', mi.name,
              'description', mi.description,
              'price', mi.price,
              'image_url', mi.image_url,
              'allergens', mi.allergens,
              'is_available', mi.is_available,
              'sort_order', mi.sort_order
            ) ORDER BY mi.sort_order, mi.name
          ) FILTER (WHERE mi.id IS NOT NULL), '[]'
        ) as menu_items
      FROM categories c
      LEFT JOIN menu_items mi ON c.id = mi.category_id
      WHERE c.restaurant_id = $1
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `, [restaurantId]);

    res.json({ categories: categoriesResult.rows });
  } catch (error) {
    console.error('Get restaurant menu error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, sort_order } = req.body;

    // Yetki kontrolü
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Category name required' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name, restaurant_id, sort_order) VALUES ($1, $2, $3) RETURNING *',
      [name, restaurantId, sort_order || 0]
    );

    res.status(201).json({
      message: 'Category created successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, sort_order, is_active } = req.body;

    // Kategorinin restoran bilgisini al ve yetki kontrolü yap
    const categoryResult = await pool.query('SELECT restaurant_id FROM categories WHERE id = $1', [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != categoryResult.rows[0].restaurant_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await pool.query(
      'UPDATE categories SET name = $1, sort_order = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, sort_order, is_active, categoryId]
    );

    res.json({
      message: 'Category updated successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Kategorinin restoran bilgisini al ve yetki kontrolü yap
    const categoryResult = await pool.query('SELECT restaurant_id FROM categories WHERE id = $1', [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != categoryResult.rows[0].restaurant_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await pool.query('DELETE FROM categories WHERE id = $1', [categoryId]);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, price, allergens, sort_order, image_data } = req.body;

    // Kategorinin restoran bilgisini al
    const categoryResult = await pool.query('SELECT restaurant_id FROM categories WHERE id = $1', [categoryId]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const restaurantId = categoryResult.rows[0].restaurant_id;

    // Yetki kontrolü
    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != restaurantId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price required' });
    }

    // Base64 image data varsa direkt kaydet
    let imageUrl = null;
    if (image_data) {
      imageUrl = image_data; // Base64 string olarak kaydet
    }

    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category_id, restaurant_id, allergens, sort_order, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, categoryId, restaurantId, allergens, sort_order || 0, imageUrl]
    );

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem: result.rows[0]
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { name, description, price, allergens, is_available, sort_order, image_data } = req.body;

    // Menu item'ın restoran bilgisini al ve yetki kontrolü yap
    const menuItemResult = await pool.query('SELECT restaurant_id, image_url FROM menu_items WHERE id = $1', [menuItemId]);
    
    if (menuItemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != menuItemResult.rows[0].restaurant_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Base64 image data varsa güncelle, yoksa mevcut image_url'yi koru
    let imageUrl = menuItemResult.rows[0].image_url;
    if (image_data !== undefined) {
      imageUrl = image_data; // Base64 string olarak kaydet veya null
    }

    const result = await pool.query(
      'UPDATE menu_items SET name = $1, description = $2, price = $3, allergens = $4, is_available = $5, sort_order = $6, image_url = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [name, description, price, allergens, is_available, sort_order, imageUrl, menuItemId]
    );

    res.json({
      message: 'Menu item updated successfully',
      menuItem: result.rows[0]
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    // Menu item'ın restoran bilgisini al ve yetki kontrolü yap
    const menuItemResult = await pool.query('SELECT restaurant_id FROM menu_items WHERE id = $1', [menuItemId]);
    
    if (menuItemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (req.user.role === 'restaurant_admin' && req.user.restaurant_id != menuItemResult.rows[0].restaurant_id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await pool.query('DELETE FROM menu_items WHERE id = $1', [menuItemId]);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const trackView = async (req, res) => {
  try {
    const { qrCode } = req.params;
    
    // Restoran bilgisini al
    const restaurantResult = await pool.query(
      'SELECT id FROM restaurants WHERE qr_code = $1 AND is_active = true',
      [qrCode]
    );

    if (restaurantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const restaurant = restaurantResult.rows[0];
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    
    await pool.query(`
      INSERT INTO restaurant_views (restaurant_id, ip_address, view_date, view_count)
      VALUES ($1, $2, CURRENT_DATE, 1)
      ON CONFLICT (restaurant_id, ip_address, view_date) 
      DO UPDATE SET view_count = restaurant_views.view_count + 1
    `, [restaurant.id, clientIp]);
    
    res.json({ message: 'View tracked' });
  } catch (error) {
    console.error('Track view error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getMenuByQR,
  getRestaurantMenu,
  createCategory,
  updateCategory,
  deleteCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  trackView
};