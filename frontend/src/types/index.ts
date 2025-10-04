export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'restaurant_admin';
  restaurant_id?: number;
  is_active: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
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
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface CategoryWithItems extends Category {
  items: MenuItem[];
}

export interface PublicMenuData {
  restaurant: {
    id: number;
    name: string;
    description?: string;
    logo_url?: string;
    cover_image_url?: string;
    theme_color: string;
  };
  categories: CategoryWithItems[];
}

export interface RestaurantStats {
  total_access: number;
  last_30_days_access: number;
  daily_access: Array<{ date: string; count: number }>;
  total_categories: number;
  total_menu_items: number;
  popular_categories: Array<{ name: string; access_count: number }>;
}

export interface AllRestaurantsStats {
  total_restaurants: number;
  total_access: number;
  last_30_days_access: number;
  restaurant_access: Array<{ id: number; name: string; access_count: number }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
