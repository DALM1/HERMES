import axios from 'axios';
import { apiClient } from './client';

const API_URL = 'http://localhost:4000/api';

// Fonction d'inscription
export const registerUser = async (username: string, email: string, password: string, full_name?: string) => {
  try {
    // Structure exacte comme dans la requête cURL
    const response = await axios.post(`${API_URL}/register`, {
      user: {
        username,
        email,
        password,
        full_name: full_name || username
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error;
  }
};

// Fonction de connexion
export const login = async (email: string, password: string) => {
  try {
    // Structure exacte comme dans la requête cURL
    const response = await axios.post(`${API_URL}/login`, { 
      user: { 
        email, 
        password 
      } 
    });
    
    // Extraction du token et des données utilisateur
    const { token, user } = response.data;
    
    // Stockage du token dans localStorage
    if (token) {
      localStorage.setItem('token', token);
    }
    
    return { token, user };
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

// Fonction de déconnexion
export const logout = async () => {
  try {
    await apiClient.post('/logout');
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    // Même en cas d'erreur, on supprime le token local
    localStorage.removeItem('token');
    throw error;
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Fonction pour récupérer le token
export const getToken = () => {
  return localStorage.getItem('token');
};