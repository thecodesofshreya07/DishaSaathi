import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  aadhaarVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dishasaathi_user');
      if (saved) return JSON.parse(saved);
      const defaultUser: User = {
        id: 'usr_shreya_01',
        name: 'Shreya Mishra',
        email: 'shreya.mishra@gov.in',
        role: 'Citizen',
        aadhaarVerified: true
      };
      localStorage.setItem('dishasaathi_user', JSON.stringify(defaultUser));
      return defaultUser;
    } catch {
      return {
        id: 'usr_shreya_01',
        name: 'Shreya Mishra',
        email: 'shreya.mishra@gov.in',
        role: 'Citizen',
        aadhaarVerified: true
      };
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
        return { success: true };
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
        return { success: true };
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
