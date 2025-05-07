import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const token = localStorage.getItem('token');
    if (token) {
      // Simuler la récupération des données utilisateur
      // Dans une application réelle, vous feriez un appel API pour valider le token
      setUser({
        id: '1',
        username: 'utilisateur',
        email: 'utilisateur@exemple.com'
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simuler un appel API
    // Dans une application réelle, vous feriez un appel API pour vous connecter
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: '1',
          username: 'utilisateur',
          email: email
        };
        setUser(mockUser);
        localStorage.setItem('token', 'mock-token');
        resolve();
      }, 1000);
    });
  };

  const register = async (username: string, email: string, password: string) => {
    // Simuler un appel API
    // Dans une application réelle, vous feriez un appel API pour vous inscrire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};