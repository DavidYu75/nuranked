import api from './api';

export interface Experience {
  title: string;
  company: string;
  description: string;
}

export interface Education {
  degree: string;
  major: string;
  graduation_year: number;
}

export interface ProfileCreate {
  name: string;
  email: string;
  password: string;
  photo_url: string;
  experiences: Experience[];
  education: Education;
  linkedin_url?: string;
  github_url?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  is_northeastern_verified: boolean;
  profile_id: string;
  name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  name: string;
  photo_url: string;
  experiences: Experience[];
  education: Education;
  elo_rating: number;
  match_count: number;
  linkedin_url: string | null;
  github_url: string | null;
  is_northeastern_verified: boolean;
}

export const registerUser = async (userData: ProfileCreate): Promise<RegisterResponse> => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify({
      profile_id: response.data.profile_id,
      name: response.data.name,
      is_northeastern_verified: response.data.is_northeastern_verified
    }));
  }
  
  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): { profile_id: string; name: string; is_northeastern_verified: boolean } | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Add authorization header to requests if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 