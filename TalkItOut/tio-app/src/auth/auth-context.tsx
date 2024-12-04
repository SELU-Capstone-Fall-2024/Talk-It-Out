import React, {createContext, useContext, useState, ReactNode} from 'react';
import api from '../api/api';
import {UserLoginDto, Response, UserDto} from '../types';
import {useAsyncFn, useAsyncRetry} from 'react-use';

const currentUser = 'currentUser';

const setUserItem = (user: UserDto) => {
  sessionStorage.setItem(currentUser, JSON.stringify(user));
};

const removeUserItem = () => {
  sessionStorage.removeItem(currentUser);
};

type AuthType = {
  user: User | null;
  loginState: any;
  getCurrentUser: () => void;
  login: (userData: UserLoginDto) => Promise<Response>;
  logout: () => void;
};

type User = {
  username: string;
};

const INITIAL_STATE: AuthType = {
  user: null,
  loginState: undefined as any,
  getCurrentUser: undefined as any,
  login: undefined as any,
  logout: undefined as any,
};

const AuthContext = createContext<AuthType>(INITIAL_STATE);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(INITIAL_STATE.user);

  const [loginState, login] = useAsyncFn(async (userData: UserLoginDto) => {
    const response = await api.post<Response>('/users/authenticate', userData);
    if (response.status === 200) {
      setUser(userData);
      setUserItem(userData);
    }
    return response.data;
  }, []);

  const getCurrentUser = useAsyncRetry(async () => {
    const response = await api.get<Response<UserDto>>(
      `/users/get-current-user`
    );

    if (response.data.hasErrors) {
      response.data.errors.forEach((err) => {
        console.error(err.message);
      });
      return response.data;
    }

    setUser(response.data.data);
    setUserItem(response.data.data);
  }, []);

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      removeUserItem();
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginState,
        getCurrentUser: getCurrentUser.retry,
        login,
        logout,
      }}
    >
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
