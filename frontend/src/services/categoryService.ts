import api from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getByRestaurant: async (restaurantId: number): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>(`/categories/${restaurantId}`);
    return response.data.data!;
  },

  create: async (categoryData: {
    restaurant_id: number;
    name: string;
    description?: string;
    display_order?: number;
  }): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/categories', categoryData);
    return response.data.data!;
  },

  update: async (id: number, categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, categoryData);
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
