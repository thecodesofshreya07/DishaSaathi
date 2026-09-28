import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  aadhaarVerified?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  loading: boolean;
}

const defaultAuthValue: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: async () => ({ success: false, error: 'Authentication not initialized' }),
  register: async () => ({ success: false, error: 'Authentication not initialized' }),
  logout: () => {},
  loading: false
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_user');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('dishasaathi_token');
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Validate or restore session
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setUser(data.user);
              localStorage.setItem('dishasaathi_user', JSON.stringify(data.user));
              if (Array.isArray(data.journeys)) {
                localStorage.setItem(`dishasaathi_journeys_${data.user.id}`, JSON.stringify(data.journeys));
              }
            }
          } else {
            // Token expired or invalid
            logout();
          }
        } catch {
          // Network issue or offline - keep cached user
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('dishasaathi_user', JSON.stringify(data.user));
        localStorage.setItem('dishasaathi_token', data.token);
        if (Array.isArray(data.journeys)) {
          localStorage.setItem(`dishasaathi_journeys_${data.user.id}`, JSON.stringify(data.journeys));
        }
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('dishasaathi_user', JSON.stringify(data.user));
        localStorage.setItem('dishasaathi_token', data.token);
        // Explicitly seed brand new user's journey cache to empty list
        localStorage.setItem(`dishasaathi_journeys_${data.user.id}`, JSON.stringify([]));
        localStorage.removeItem('dishasaathi_saved_journey');
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dishasaathi_user');
    localStorage.removeItem('dishasaathi_token');
    localStorage.removeItem('dishasaathi_saved_journey');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultAuthValue;
};
