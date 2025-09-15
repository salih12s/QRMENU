import api from './api';

export const restaurantService = {
  getAllRestaurants: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  getRestaurant: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  createRestaurant: async (restaurantData) => {
    const response = await api.post('/restaurants', restaurantData);
    return response.data;
  },

  updateRestaurant: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  deleteRestaurant: async (id) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  generateQRCode: async (id) => {
    const response = await api.get(`/restaurants/${id}/qr`);
    return response.data;
  }
};