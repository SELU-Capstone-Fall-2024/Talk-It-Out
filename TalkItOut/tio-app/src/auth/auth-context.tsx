import React, {createContext, useContext, useState, ReactNode} from 'react';
import api from '../api/api';
import {UserLoginDto, Response, UserDto} from '../types';
import {useAsyncFn, useAsyncRetry} from 'react-use';
import Login from '../components/login';

const currentUser = 'currentUser';

const setUserItem = (user: UserDto) => {
  sessionStorage.setItem(currentUser, JSON.stringify(user));
};

const removeUserItem = () => {
  sessionStorage.removeItem(currentUser);
};

type AuthType = {
  user: User | null;
  setUser: any;
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
  setUser: undefined as any,
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
      const user: User = {username: userData.userName}
      const userItem: UserDto = {id: 1}
      setUser(user);
      setUserItem(userItem);
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

    if (response.data.data){
      const user: User = {username: response.data.data?.id.toString()}
      setUser(user);
      setUserItem(response.data.data);
    }

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

  if (getCurrentUser.loading) {
    return <>Loading...</>
  }

  if (!user && !getCurrentUser.loading){
    return <Login   />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loginState,
        setUser: setUser,
        getCurrentUser: getCurrentUser.retry,
        login: login,
        logout: logout,
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
