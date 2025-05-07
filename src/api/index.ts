// Client API de base
import { getToken } from '../utils/auth';

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export const API_BASE_URL = window.apiConfig.baseUrl;

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    ...(options.body && { body: JSON.stringify(options.body) }),
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }
    
    // Pour les requêtes qui ne retournent pas de contenu
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    throw error;
  }
}