import api from './api';
import { MenuItem, ApiResponse } from '../types';

export const menuService = {
  getByRestaurant: async (restaurantId: number, categoryId?: number): Promise<MenuItem[]> => {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get<ApiResponse<MenuItem[]>>(`/menu/${restaurantId}`, { params });
    return response.data.data!;
  },

  create: async (formData: FormData): Promise<MenuItem> => {
    const response = await api.post<ApiResponse<MenuItem>>('/menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  update: async (id: number, formData: FormData): Promise<MenuItem> => {
    const response = await api.put<ApiResponse<MenuItem>>(`/menu/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/menu/${id}`);
  },
};
