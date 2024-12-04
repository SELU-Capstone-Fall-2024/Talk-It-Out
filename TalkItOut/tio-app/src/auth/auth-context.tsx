import React, {createContext, useContext, useState, ReactNode} from 'react';
import api from '../api/api';
import {UserLoginDto, Response} from '../types';
import {useAsyncFn} from 'react-use';

type AuthType = {
  user: User | null;
  loginState: any;
  login: (userData: UserLoginDto) => Promise<Response>;
  logout: () => void;
};

type User = {
  username: string;
};

const INITIAL_STATE: AuthType = {
  user: null,
  loginState: undefined as any,
  login: undefined as any,
  logout: undefined as any,
};

const AuthContext = createContext<AuthType>(INITIAL_STATE);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const [loginState, login] = useAsyncFn(async (userData: UserLoginDto) => {
    const response = await api.post<Response>('/users/authenticate', userData);
    if (response.status === 200) {
      setUser(userData);
    }
    return response.data;
  }, []);

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{user, loginState, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return useContext(AuthContext);
};
