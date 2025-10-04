import { Request, Response } from 'express';
import { query } from '../config/database';
import { ApiResponse } from '../types';

export const getRestaurantStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    // Toplam erişim sayısı
    const accessResult = await query(
      'SELECT COUNT(*) as total_access FROM access_logs WHERE restaurant_id = $1',
      [restaurantId]
    );

    // Son 30 gün erişim sayısı
    const last30DaysResult = await query(
      `SELECT COUNT(*) as last_30_days 
       FROM access_logs 
       WHERE restaurant_id = $1 AND accessed_at >= NOW() - INTERVAL '30 days'`,
      [restaurantId]
    );

    // Günlük erişim istatistikleri (son 7 gün)
    const dailyAccessResult = await query(
      `SELECT DATE(accessed_at) as date, COUNT(*) as count
       FROM access_logs
       WHERE restaurant_id = $1 AND accessed_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(accessed_at)
       ORDER BY date DESC`,
      [restaurantId]
    );

    // Toplam kategori sayısı
    const categoryResult = await query(
      'SELECT COUNT(*) as total_categories FROM categories WHERE restaurant_id = $1',
      [restaurantId]
    );

    // Toplam ürün sayısı
    const menuItemResult = await query(
      'SELECT COUNT(*) as total_items FROM menu_items WHERE restaurant_id = $1',
      [restaurantId]
    );

    // En popüler kategoriler (erişim loglarına göre)
    const popularCategoriesResult = await query(
      `SELECT c.name, COUNT(*) as access_count
       FROM access_logs al
       JOIN restaurants r ON al.restaurant_id = r.id
       JOIN categories c ON c.restaurant_id = r.id
       WHERE al.restaurant_id = $1
       GROUP BY c.id, c.name
       ORDER BY access_count DESC
       LIMIT 5`,
      [restaurantId]
    );

    res.json({ 
      success: true, 
      data: {
        total_access: parseInt(accessResult.rows[0].total_access),
        last_30_days_access: parseInt(last30DaysResult.rows[0].last_30_days),
        daily_access: dailyAccessResult.rows,
        total_categories: parseInt(categoryResult.rows[0].total_categories),
        total_menu_items: parseInt(menuItemResult.rows[0].total_items),
        popular_categories: popularCategoriesResult.rows
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get restaurant stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'İstatistikler alınamadı' 
    } as ApiResponse);
  }
};

export const getAllRestaurantsStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Toplam restoran sayısı
    const restaurantResult = await query(
      'SELECT COUNT(*) as total_restaurants FROM restaurants WHERE is_active = true'
    );

    // Toplam erişim sayısı
    const accessResult = await query(
      'SELECT COUNT(*) as total_access FROM access_logs'
    );

    // Son 30 gün erişim
    const last30DaysResult = await query(
      `SELECT COUNT(*) as last_30_days 
       FROM access_logs 
       WHERE accessed_at >= NOW() - INTERVAL '30 days'`
    );

    // Restoran bazlı erişim sayıları
    const restaurantAccessResult = await query(
      `SELECT r.id, r.name, COUNT(al.id) as access_count
       FROM restaurants r
       LEFT JOIN access_logs al ON r.id = al.restaurant_id
       WHERE r.is_active = true
       GROUP BY r.id, r.name
       ORDER BY access_count DESC`
    );

    res.json({ 
      success: true, 
      data: {
        total_restaurants: parseInt(restaurantResult.rows[0].total_restaurants),
        total_access: parseInt(accessResult.rows[0].total_access),
        last_30_days_access: parseInt(last30DaysResult.rows[0].last_30_days),
        restaurant_access: restaurantAccessResult.rows
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get all restaurants stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'İstatistikler alınamadı' 
    } as ApiResponse);
  }
};
