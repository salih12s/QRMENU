import { Request, Response } from 'express';
import { query } from '../config/database';
import { Restaurant, Category, MenuItem, ApiResponse } from '../types';

export const getMenuByQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrCode } = req.params;

    // Restoran bilgisini al
    const restaurantResult = await query<Restaurant>(
      'SELECT * FROM restaurants WHERE qr_code = $1 AND is_active = true',
      [qrCode]
    );

    if (restaurantResult.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Restoran bulunamadı veya aktif değil' 
      } as ApiResponse);
      return;
    }

    const restaurant = restaurantResult.rows[0];

    // Kategorileri al
    const categoriesResult = await query<Category>(
      'SELECT * FROM categories WHERE restaurant_id = $1 AND is_active = true ORDER BY display_order',
      [restaurant.id]
    );

    // Menü ürünlerini al
    const menuItemsResult = await query<MenuItem>(
      `SELECT * FROM menu_items 
       WHERE restaurant_id = $1 AND is_available = true 
       ORDER BY display_order`,
      [restaurant.id]
    );

    // Kategorilere göre ürünleri grupla
    const categoriesWithItems = categoriesResult.rows.map((category: Category) => ({
      ...category,
      items: menuItemsResult.rows
        .filter((item: MenuItem) => item.category_id === category.id)
        .map((item: MenuItem) => ({
          ...item,
          price: parseFloat(item.price as any) // PostgreSQL NUMERIC to number
        }))
    }));

    // Erişim logu kaydet
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    await query(
      `INSERT INTO access_logs (restaurant_id, qr_code, ip_address, user_agent)
       VALUES ($1, $2, $3, $4)`,
      [restaurant.id, qrCode, ipAddress, userAgent]
    );

    res.json({ 
      success: true, 
      data: {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          logo_url: restaurant.logo_url,
          cover_image_url: restaurant.cover_image_url,
          theme_color: restaurant.theme_color
        },
        categories: categoriesWithItems
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get menu by QR code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Menü bilgisi alınamadı' 
    } as ApiResponse);
  }
};
