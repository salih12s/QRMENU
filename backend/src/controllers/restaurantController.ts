import { Request, Response } from 'express';
import { query } from '../config/database';
import QRCode from 'qrcode';
import { Restaurant, ApiResponse } from '../types';

export const getAllRestaurants = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<Restaurant>(
      'SELECT * FROM restaurants ORDER BY created_at DESC'
    );

    res.json({ 
      success: true, 
      data: result.rows 
    } as ApiResponse);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Restoranlar listelenemedi' 
    } as ApiResponse);
  }
};

export const getRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query<Restaurant>(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Restoran bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      data: result.rows[0] 
    } as ApiResponse);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Restoran bilgisi alınamadı' 
    } as ApiResponse);
  }
};

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      description, 
      contact_phone, 
      contact_email, 
      address, 
      theme_color 
    } = req.body;

    if (!name) {
      res.status(400).json({ 
        success: false, 
        message: 'Restoran adı gereklidir' 
      } as ApiResponse);
      return;
    }

    // Benzersiz QR kod oluştur
    const qrCode = `${name.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`;
    
    // QR kod görselini oluştur
    const frontendUrl = process.env.FRONTEND_URL || 'https://menuben.com';
    const qrCodeImage = await QRCode.toDataURL(
      `${frontendUrl}/menu/${qrCode}`
    );

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo_url = files?.logo?.[0] ? `/uploads/${files.logo[0].filename}` : null;
    const cover_image_url = files?.cover_image?.[0] ? `/uploads/${files.cover_image[0].filename}` : null;

    const result = await query<Restaurant>(
      `INSERT INTO restaurants 
       (name, description, logo_url, cover_image_url, contact_phone, contact_email, address, theme_color, qr_code, qr_code_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        name, 
        description, 
        logo_url,
        cover_image_url, 
        contact_phone, 
        contact_email, 
        address, 
        theme_color || '#1976d2',
        qrCode,
        qrCodeImage
      ]
    );

    res.status(201).json({ 
      success: true, 
      data: result.rows[0],
      message: 'Restoran başarıyla oluşturuldu' 
    } as ApiResponse);
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Restoran oluşturulamadı' 
    } as ApiResponse);
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      contact_phone, 
      contact_email, 
      address, 
      theme_color,
      is_active
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo_url = files?.logo?.[0] ? `/uploads/${files.logo[0].filename}` : undefined;
    const cover_image_url = files?.cover_image?.[0] ? `/uploads/${files.cover_image[0].filename}` : undefined;

    let updateQuery = `
      UPDATE restaurants 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          contact_phone = COALESCE($3, contact_phone),
          contact_email = COALESCE($4, contact_email),
          address = COALESCE($5, address),
          theme_color = COALESCE($6, theme_color),
          is_active = COALESCE($7, is_active),
          updated_at = CURRENT_TIMESTAMP
    `;

    const params: any[] = [
      name, 
      description, 
      contact_phone, 
      contact_email, 
      address, 
      theme_color,
      is_active
    ];

    let paramIndex = 8;
    if (logo_url) {
      updateQuery += `, logo_url = $${paramIndex}`;
      params.push(logo_url);
      paramIndex++;
    }
    if (cover_image_url) {
      updateQuery += `, cover_image_url = $${paramIndex}`;
      params.push(cover_image_url);
      paramIndex++;
    }

    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);

    const result = await query<Restaurant>(updateQuery, params);

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Restoran bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'Restoran başarıyla güncellendi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Restoran güncellenemedi' 
    } as ApiResponse);
  }
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM restaurants WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Restoran bulunamadı' 
      } as ApiResponse);
      return;
    }

    res.json({ 
      success: true, 
      message: 'Restoran başarıyla silindi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Restoran silinemedi' 
    } as ApiResponse);
  }
};

export const regenerateQRCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const restaurantResult = await query<Restaurant>(
      'SELECT name FROM restaurants WHERE id = $1',
      [id]
    );

    if (restaurantResult.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Restoran bulunamadı' 
      } as ApiResponse);
      return;
    }

    const name = restaurantResult.rows[0].name;
    const qrCode = `${name.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`;
    
    const frontendUrl = process.env.FRONTEND_URL || 'https://menuben.com';
    const qrCodeImage = await QRCode.toDataURL(
      `${frontendUrl}/menu/${qrCode}`
    );

    const result = await query<Restaurant>(
      `UPDATE restaurants 
       SET qr_code = $1, qr_code_image = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [qrCode, qrCodeImage, id]
    );

    res.json({ 
      success: true, 
      data: result.rows[0],
      message: 'QR kod başarıyla yenilendi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Regenerate QR code error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'QR kod yenilenemedi' 
    } as ApiResponse);
  }
};
