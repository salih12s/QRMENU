import api from './api';
import { RestaurantStats, AllRestaurantsStats, ApiResponse } from '../types';

export const reportService = {
  getRestaurantStats: async (restaurantId: number): Promise<RestaurantStats> => {
    const response = await api.get<ApiResponse<RestaurantStats>>(`/reports/restaurant/${restaurantId}`);
    return response.data.data!;
  },

  getAllRestaurantsStats: async (): Promise<AllRestaurantsStats> => {
    const response = await api.get<ApiResponse<AllRestaurantsStats>>('/reports/all');
    return response.data.data!;
  },
};
