'use client'

import axios from 'axios';

// Create axios instance with base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get user data' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Dream Journal services
export const dreamJournalService = {
  // Get all dream journal entries
  getAllEntries: async () => {
    try {
      const response = await api.get('/dream-journal');
      return response.data.entries;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch dream journal entries' };
    }
  },

  // Get a specific dream journal entry
  getEntry: async (id) => {
    try {
      const response = await api.get(`/dream-journal/${id}`);
      return response.data.entry;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch dream journal entry' };
    }
  },

  // Create a new dream journal entry
  createEntry: async (entryData) => {
    try {
      const response = await api.post('/dream-journal', entryData);
      return response.data.entry;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create dream journal entry' };
    }
  },

  // Update a dream journal entry
  updateEntry: async (id, entryData) => {
    try {
      const response = await api.put(`/dream-journal/${id}`, entryData);
      return response.data.entry;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update dream journal entry' };
    }
  },

  // Delete a dream journal entry
  deleteEntry: async (id) => {
    try {
      const response = await api.delete(`/dream-journal/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete dream journal entry' };
    }
  }
};

// Practice Session services
export const practiceSessionService = {
  // Get all practice sessions
  getAllSessions: async () => {
    try {
      const response = await api.get('/practice-session');
      return response.data.sessions;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch practice sessions' };
    }
  },

  // Get a specific practice session
  getSession: async (id) => {
    try {
      const response = await api.get(`/practice-session/${id}`);
      return response.data.session;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch practice session' };
    }
  },

  // Create a new practice session
  createSession: async (sessionData) => {
    try {
      const response = await api.post('/practice-session', sessionData);
      return response.data.session;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create practice session' };
    }
  },

  // Update a practice session
  updateSession: async (id, sessionData) => {
    try {
      const response = await api.put(`/practice-session/${id}`, sessionData);
      return response.data.session;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update practice session' };
    }
  },

  // Delete a practice session
  deleteSession: async (id) => {
    try {
      const response = await api.delete(`/practice-session/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete practice session' };
    }
  }
};

// Progress Tracking services
export const progressTrackingService = {
  // Get progress metrics
  getMetrics: async (timeRange = '') => {
    try {
      const response = await api.get('/progress-tracking', {
        params: { timeRange }
      });
      return response.data.metrics;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch progress metrics' };
    }
  },

  // Get summary statistics
  getSummary: async (timeRange = '') => {
    try {
      const response = await api.get('/progress-tracking/summary', {
        params: { timeRange }
      });
      return response.data.summary;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch progress summary' };
    }
  },

  // Get streak information
  getStreak: async () => {
    try {
      const response = await api.get('/progress-tracking/streak');
      return response.data.streak;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch streak information' };
    }
  }
};

// Audio Resource services
export const audioResourceService = {
  // Get all audio resources
  getAllResources: async (category = '') => {
    try {
      const response = await api.get('/audio-resource', {
        params: { category }
      });
      return response.data.resources;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch audio resources' };
    }
  },

  // Get a specific audio resource
  getResource: async (id) => {
    try {
      const response = await api.get(`/audio-resource/${id}`);
      return response.data.resource;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch audio resource' };
    }
  },

  // Get audio file URL
  getAudioFileUrl: (filename) => {
    return `${API_BASE_URL}/audio-resource/file/${filename}`;
  }
};

export default api;
