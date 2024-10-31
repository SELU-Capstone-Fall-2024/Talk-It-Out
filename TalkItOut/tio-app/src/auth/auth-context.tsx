import React, {createContext, useContext, useState, ReactNode} from 'react';
import api from '../api/api';
import {UserLoginDto} from '../types';

type AuthContext = {
  user: User | null;
  login: (userData: UserLoginDto) => void;
  logout: () => void;
};

type User = {
  username: string;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (userData: UserLoginDto) => {
    try {
      const response = await api.post('/users/authenticate', {
        userData,
      });
      if (response.status === 200) {
        setUser(userData);
      }
    } catch (_) {
      throw new Error('Error logging in');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
