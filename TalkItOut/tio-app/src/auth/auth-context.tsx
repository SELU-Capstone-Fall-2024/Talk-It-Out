import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import api from '../api/api';
import {UserLoginDto, Response} from '../types';
import {useAsyncFn} from 'react-use';

type AuthContext = {
  user: User | null;
  loginState: any;
  login: (userData: UserLoginDto) => Promise<Response>;
  logout: () => void;
};

type User = {
  username: string;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [loginState, login] = useAsyncFn(async (userData: UserLoginDto) => {
    const response = await api.post<Response>('/users/authenticate', userData);
    if (response.status === 200) {
      const user: User = {username: userData.userName};
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  }, []);

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{user, loginState, login: login, logout}}>
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
