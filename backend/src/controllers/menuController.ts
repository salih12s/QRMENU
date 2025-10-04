import { Request, Response } from 'express';
import { query } from '../config/database';
import { MenuItem, ApiResponse } from '../types';

export const getMenuItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;
    const { categoryId } = req.query;

    let queryText = `
      SELECT mi.*, c.name as category_name 
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
      WHERE mi.restaurant_id = $1
    `;
    const params: any[] = [restaurantId];

    if (categoryId) {
      queryText += ' AND mi.category_id = $2';
      params.push(categoryId);
    }

    queryText += ' ORDER BY mi.display_order, mi.created_at';

    const result = await query(queryText, params);

    // PostgreSQL NUMERIC to number
    const menuItems = result.rows.map(item => ({
      ...item,
      price: parseFloat(item.price as any)
    }));

    res.json({ 
      success: true, 
      data: menuItems 
    } as ApiResponse);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Menü ürünleri listelenemedi' 
    } as ApiResponse);
  }
};

export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      restaurant_id, 
      category_id, 
      name, 
      description, 
      price, 
      allergen_info,
      display_order 
    } = req.body;

    if (!restaurant_id || !category_id || !name || !price) {
      res.status(400).json({ 
        success: false, 
        message: 'Restoran ID, kategori ID, ürün adı ve fiyat gereklidir' 
      } as ApiResponse);
      return;
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await query<MenuItem>(
      `INSERT INTO menu_items 
       (restaurant_id, category_id, name, description, price, image_url, allergen_info, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        restaurant_id, 
        category_id, 
        name, 
        description, 
        price, 
        image_url, 
        allergen_info,
        display_order || 0
      ]
    );

    const menuItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price as any)
    };

    res.status(201).json({ 
      success: true, 
      data: menuItem,
      message: 'Ürün başarıyla oluşturuldu' 
    } as ApiResponse);
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ürün oluşturulamadı' 
    } as ApiResponse);
  }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      category_id,
      name, 
      description, 
      price, 
      allergen_info,
      is_available,
      display_order 
    } = req.body;

    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    let updateQuery = `
      UPDATE menu_items 
      SET category_id = COALESCE($1, category_id),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          price = COALESCE($4, price),
          allergen_info = COALESCE($5, allergen_info),
          is_available = COALESCE($6, is_available),
          display_order = COALESCE($7, display_order),
          updated_at = CURRENT_TIMESTAMP
    `;

    const params: any[] = [
      category_id,
      name, 
      description, 
      price, 
      allergen_info,
      is_available,
      display_order
    ];

    if (image_url) {
      updateQuery += `, image_url = $8 WHERE id = $9 RETURNING *`;
      params.push(image_url, id);
    } else {
      updateQuery += ` WHERE id = $8 RETURNING *`;
      params.push(id);
    }

    const result = await query<MenuItem>(updateQuery, params);

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Ürün bulunamadı' 
      } as ApiResponse);
      return;
    }

    const menuItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price as any)
    };

    res.json({ 
      success: true, 
      data: menuItem,
      message: 'Ürün başarıyla güncellendi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ürün güncellenemedi' 
    } as ApiResponse);
  }
};

export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM menu_items WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Ürün bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      message: 'Ürün başarıyla silindi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ürün silinemedi' 
    } as ApiResponse);
  }
};
