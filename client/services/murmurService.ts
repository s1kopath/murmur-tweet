import api from './api';

export interface Murmur {
  id: number;
  user_id: number;
  text: string;
  likes_count: number;
  created_at: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateMurmurData {
  text: string;
}

export const murmurService = {
  getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Murmur>> => {
    const response = await api.get('/murmurs', { params: { page, limit } });
    return response.data;
  },

  getTimeline: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Murmur>> => {
    const response = await api.get('/murmurs/timeline', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: number): Promise<Murmur> => {
    const response = await api.get(`/murmurs/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Murmur>> => {
    const response = await api.get(`/murmurs/users/${userId}`, { params: { page, limit } });
    return response.data;
  },

  create: async (data: CreateMurmurData): Promise<Murmur> => {
    const response = await api.post('/murmurs', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/murmurs/${id}`);
  },
};

