import axios from 'axios';
import { PublicMenuData, ApiResponse } from '../types';

export const publicService = {
  getMenuByQRCode: async (qrCode: string): Promise<PublicMenuData> => {
    const response = await axios.get<ApiResponse<PublicMenuData>>(
      `${import.meta.env.VITE_API_URL || '/api'}/public/menu/${qrCode}`
    );
    return response.data.data!;
  },
};
