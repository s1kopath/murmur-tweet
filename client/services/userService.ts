import api from './api';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  followers_count: number;
  following_count: number;
  created_at: string;
}

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

