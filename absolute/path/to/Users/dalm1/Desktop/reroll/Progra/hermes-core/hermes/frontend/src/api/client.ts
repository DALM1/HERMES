import axios from 'axios';

export const apiClient = axios.create({
  baseURL: window.apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});
