export interface User {
  id: number;
  email: string;
  password: string;
  full_name: string;
  role: 'super_admin' | 'restaurant_admin';
  restaurant_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserDTO {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'restaurant_admin';
  restaurant_id?: number;
  is_active: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  logo_url?: string;
  cover_image_url?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  theme_color: string;
  qr_code: string;
  qr_code_image?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MenuItem {
  id: number;
  restaurant_id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  allergen_info?: string;
  is_available: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AccessLog {
  id: number;
  restaurant_id: number;
  qr_code: string;
  table_number?: string;
  ip_address?: string;
  user_agent?: string;
  accessed_at: Date;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'restaurant_admin';
  restaurant_id?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
