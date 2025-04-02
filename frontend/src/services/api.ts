import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRandomProfiles = async () => {
  const response = await api.get('/api/profiles/random');
  return response.data;
};

export const voteProfile = async (profileId: string) => {
  const response = await api.put(`/api/profiles/${profileId}/vote`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/api/leaderboard');
  return response.data;
};

export default api;
