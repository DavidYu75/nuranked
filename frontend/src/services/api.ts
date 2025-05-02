import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Experience {
  title: string;
  company: string;
  description: string;
}

interface Education {
  degree: string;
  major: string;
  graduation_year: number;
}

interface Club {
  id: string;
  name: string;
}

interface ProfileData {
  name: string;
  email: string;
  photo_url: string;
  experiences: Experience[];
  clubs: Club[];
  education: Education;
  elo_rating: number;
  match_count: number;
  linkedin_url?: string;
  github_url?: string;
  is_northeastern_verified: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

export const getProfile = async (profileId: string) => {
  const response = await api.get(`/api/profiles/${profileId}`);
  return response.data;
};

export const updateProfile = async (profileId: string, profileData: Partial<ProfileData>) => {
  const response = await api.put(`/api/profiles/${profileId}`, profileData);
  return response.data;
};

export default api;
