import React from 'react';
import api from '../api/api';
import { Response, UserGetDto } from '../types';
import { useAsync } from 'react-use';
import Loader from '../components/Loader';

const Users: React.FC = () => {
  const { loading, value: users } = useAsync( async () => {
      const response = await api.get<Response<UserGetDto[]>>('/users');
      return response.data;     
  });

  return (
    <div>
      <h1>Users</h1>
      {loading && <Loader />}
      {users?.hasErrors && <div>Error loading users.</div>}
      {users && !loading && users.data?.length === 0 && <div>No users found.</div>}
      {!loading && users && (
        <ul>
          {users.data?.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}; 
export default Users;