// Fonctions de gestion des tokens d'authentification

/**
 * Clé utilisée pour stocker le token dans le localStorage
 */
const TOKEN_KEY = 'hermes_auth_token';

/**
 * Récupère le token d'authentification depuis le localStorage
 * @returns {string|null} Le token ou null si non trouvé
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Enregistre le token d'authentification dans le localStorage
 * @param {string} token - Le token à enregistrer
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Supprime le token d'authentification du localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Vérifie si un utilisateur est authentifié
 * @returns {boolean} true si un token existe
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}