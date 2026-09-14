import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { userService } from '../services/userService';
import type { LoginInput, User } from '../services/userService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginInput) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        setUser(await userService.getMe());
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    void loadCurrentUser();
  }, []);

  const signIn = async (credentials: LoginInput) => {
    await userService.login(credentials);
    setUser(await userService.getMe());
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
