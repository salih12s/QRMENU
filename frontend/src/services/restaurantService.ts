import api from './api';
import { Restaurant, ApiResponse } from '../types';

export const restaurantService = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await api.get<ApiResponse<Restaurant[]>>('/restaurants');
    return response.data.data!;
  },

  getById: async (id: number): Promise<Restaurant> => {
    const response = await api.get<ApiResponse<Restaurant>>(`/restaurants/${id}`);
    return response.data.data!;
  },

  create: async (formData: FormData): Promise<Restaurant> => {
    const response = await api.post<ApiResponse<Restaurant>>('/restaurants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  update: async (id: number, formData: FormData): Promise<Restaurant> => {
    const response = await api.put<ApiResponse<Restaurant>>(`/restaurants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/restaurants/${id}`);
  },

  regenerateQR: async (id: number): Promise<Restaurant> => {
    const response = await api.post<ApiResponse<Restaurant>>(`/restaurants/${id}/regenerate-qr`);
    return response.data.data!;
  },
};
