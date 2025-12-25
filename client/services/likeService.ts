import api from './api';

export const likeService = {
  like: async (murmurId: number): Promise<void> => {
    await api.post(`/likes/murmurs/${murmurId}`);
  },

  unlike: async (murmurId: number): Promise<void> => {
    await api.delete(`/likes/murmurs/${murmurId}`);
  },

  getLikeStatus: async (murmurId: number): Promise<boolean> => {
    const response = await api.get(`/likes/murmurs/${murmurId}/status`);
    return response.data.isLiked;
  },
};
