import React from 'react';
import api from '../api/api';
import { User } from '../types';
import { useAsync } from 'react-use';
import Loader from '../components/Loader';

const Users: React.FC = () => {
  const { loading, value: users, error } = useAsync( async () => {
    try {
      const response = await api.get('/users');
      return response.data; // Axios places data here by default
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  });

  return (
    <div>
      <h1>Users</h1>
      {loading && <Loader />}
      {error && <div>Error loading users.</div>}
      {!loading && !error && users?.length === 0 && <div>No users found.</div>}
      {!loading && users && (
        <ul>
          {users.map((user: User) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}; 
export default Users;