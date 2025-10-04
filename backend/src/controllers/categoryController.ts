import { Request, Response } from 'express';
import { query } from '../config/database';
import { Category, ApiResponse } from '../types';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurantId } = req.params;

    const result = await query<Category>(
      'SELECT * FROM categories WHERE restaurant_id = $1 ORDER BY display_order, created_at',
      [restaurantId]
    );

    res.json({ 
      success: true, 
      data: result.rows 
    } as ApiResponse);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kategoriler listelenemedi' 
    } as ApiResponse);
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { restaurant_id, name, description, display_order } = req.body;

    if (!restaurant_id || !name) {
      res.status(400).json({ 
        success: false, 
        message: 'Restoran ID ve kategori adı gereklidir' 
      } as ApiResponse);
      return;
    }

    const result = await query<Category>(
      `INSERT INTO categories (restaurant_id, name, description, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurant_id, name, description, display_order || 0]
    );

    res.status(201).json({ 
      success: true, 
      data: result.rows[0],
      message: 'Kategori başarıyla oluşturuldu' 
    } as ApiResponse);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kategori oluşturulamadı' 
    } as ApiResponse);
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, display_order, is_active } = req.body;

    const result = await query<Category>(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           display_order = COALESCE($3, display_order),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Kategori bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Kategori başarıyla güncellendi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kategori güncellenemedi' 
    } as ApiResponse);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Kategori bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      message: 'Kategori başarıyla silindi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kategori silinemedi' 
    } as ApiResponse);
  }
};
