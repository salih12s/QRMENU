import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { User, UserDTO, JWTPayload, ApiResponse } from '../types';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false, 
        message: 'Email ve şifre gereklidir' 
      } as ApiResponse);
      return;
    }

    const result = await query<User>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ 
        success: false, 
        message: 'Geçersiz email veya şifre' 
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: 'Geçersiz email veya şifre' 
      } as ApiResponse);
      return;
    }

    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      restaurant_id: user.restaurant_id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });

    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
      is_active: user.is_active
    };

    res.json({ 
      success: true, 
      data: { user: userDTO, token } 
    } as ApiResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Giriş işlemi başarısız' 
    } as ApiResponse);
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<User>(
      'SELECT * FROM users WHERE id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      } as ApiResponse);
      return;
    }

    const user = result.rows[0];
    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
      is_active: user.is_active
    };

    res.json({ 
      success: true, 
      data: userDTO 
    } as ApiResponse);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kullanıcı bilgisi alınamadı' 
    } as ApiResponse);
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role, restaurant_id } = req.body;

    if (!email || !password || !full_name || !role) {
      res.status(400).json({ 
        success: false, 
        message: 'Gerekli alanlar eksik' 
      } as ApiResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query<User>(
      `INSERT INTO users (email, password, full_name, role, restaurant_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [email, hashedPassword, full_name, role, restaurant_id || null]
    );

    const user = result.rows[0];
    const userDTO: UserDTO = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
      is_active: user.is_active
    };

    res.status(201).json({ 
      success: true, 
      data: userDTO,
      message: 'Kullanıcı başarıyla oluşturuldu' 
    } as ApiResponse);
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code === '23505') {
      res.status(400).json({ 
        success: false, 
        message: 'Bu email adresi zaten kullanılıyor' 
      } as ApiResponse);
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Kullanıcı oluşturulamadı' 
      } as ApiResponse);
    }
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query<User>(
      'SELECT * FROM users ORDER BY created_at DESC'
    );

    const users: UserDTO[] = result.rows.map((user: User) => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      restaurant_id: user.restaurant_id,
      is_active: user.is_active
    }));

    res.json({ 
      success: true, 
      data: users 
    } as ApiResponse);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kullanıcılar alınamadı' 
    } as ApiResponse);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Kendi hesabını silemesin
    if (req.user!.id === parseInt(id)) {
      res.status(400).json({ 
        success: false, 
        message: 'Kendi hesabınızı silemezsiniz' 
      } as ApiResponse);
      return;
    }

    await query('DELETE FROM users WHERE id = $1', [id]);

    res.json({ 
      success: true, 
      message: 'Kullanıcı silindi' 
    } as ApiResponse);
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Kullanıcı silinemedi' 
    } as ApiResponse);
  }
};

