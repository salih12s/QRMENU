import api from './api';
import { LoginResponse, User, ApiResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password });
    if (response.data.data) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data.data!;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  createUser: async (userData: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    restaurant_id?: number;
  }): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return response.data.data!;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>('/auth/users');
    return response.data.data!;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/auth/users/${id}`);
  },
};
