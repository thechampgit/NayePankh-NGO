// Placeholder service for future backend APIs
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nayepankh.org/v1';

export const apiService = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`API GET ${endpoint} error:`, error);
      throw error;
    }
  },
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`API POST ${endpoint} error:`, error);
      throw error;
    }
  }
};
