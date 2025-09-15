import api from './api';

export const menuService = {
  getMenuByQR: async (qrCode) => {
    const response = await api.get(`/menu/qr/${qrCode}`);
    return response.data;
  },

  getRestaurantMenu: async (restaurantId) => {
    const response = await api.get(`/menu/restaurant/${restaurantId}`);
    return response.data;
  },

  createCategory: async (restaurantId, categoryData) => {
    const response = await api.post(`/menu/restaurant/${restaurantId}/categories`, categoryData);
    return response.data;
  },

  updateCategory: async (categoryId, categoryData) => {
    const response = await api.put(`/menu/categories/${categoryId}`, categoryData);
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/menu/categories/${categoryId}`);
    return response.data;
  },

  createMenuItem: async (categoryId, itemData) => {
    const response = await api.post(`/menu/categories/${categoryId}/items`, itemData);
    return response.data;
  },

  updateMenuItem: async (itemId, itemData) => {
    const response = await api.put(`/menu/items/${itemId}`, itemData);
    return response.data;
  },

  deleteMenuItem: async (itemId) => {
    const response = await api.delete(`/menu/items/${itemId}`);
    return response.data;
  }
};