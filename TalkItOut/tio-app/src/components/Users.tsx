import React from 'react';
import api from '../api/api';
import { User } from '../types';
import { useAsync } from 'react-use';

const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

const Users: React.FC = () => {
  const { loading, error, value: users } = useAsync(getUsers);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (users && users.length === 0) return <div>No users found.</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;