import api from './api';

export const likeService = {
  like: async (murmurId: number): Promise<void> => {
    await api.post(`/likes/murmurs/${murmurId}`);
  },

  unlike: async (murmurId: number): Promise<void> => {
    await api.delete(`/likes/murmurs/${murmurId}`);
  },

  getUserLikedMurmurs: async (): Promise<number[]> => {
    // This would require a backend endpoint, for now we'll handle it client-side
    return [];
  },
};
