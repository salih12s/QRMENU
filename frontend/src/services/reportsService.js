import api from './api';

export const reportsService = {
  getRestaurantReports: async (restaurantId, startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get(`/reports/restaurant/${restaurantId}`, { params });
    return response.data;
  },

  getSuperAdminReports: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await api.get('/reports/admin/system', { params });
    return response.data;
  }
};