import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000', // Sans le préfixe /api
  timeout: 100,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter automatiquement /api pour les routes d'authentification
    const authRoutes = ['/login', '/register', '/users'];
    const needsApiPrefix = authRoutes.some(route => config.url?.startsWith(route));

    // Ajouter automatiquement /api pour les requêtes messages
    const messageRoutes = ['/conversations/'];
    const needsApiPrefixForMessages = messageRoutes.some(route =>
      config.url?.includes(route) &&
      (config.url?.includes('/messages') || config.method === 'post')
    );

    if ((needsApiPrefix || needsApiPrefixForMessages) && !config.url?.startsWith('/api')) {
      config.url = `/api${config.url}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log détaillé pour le débogage
    console.error('Détail de l\'erreur:', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
      } : 'Configuration non disponible',
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'Pas de réponse'
    });

    if (error.code === 'ERR_NETWORK') {
      console.error('Erreur de connexion au serveur. Vérifiez que le serveur backend est en cours d\'exécution.');
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
