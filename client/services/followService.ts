import api from './api';

export const followService = {
  follow: async (userId: number): Promise<void> => {
    await api.post(`/follows/${userId}`);
  },

  unfollow: async (userId: number): Promise<void> => {
    await api.delete(`/follows/${userId}`);
  },

  getFollowStatus: async (userId: number): Promise<boolean> => {
    const response = await api.get(`/follows/${userId}/status`);
    return response.data.isFollowing;
  },
};

