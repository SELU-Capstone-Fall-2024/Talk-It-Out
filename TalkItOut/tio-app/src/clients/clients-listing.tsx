import React from 'react';
import api from '../api/api';
import {Response, ClientGetDto} from '../types';
import {useAsync} from 'react-use';
import Loader from '../components/loader';

const Clients: React.FC = () => {
  const {loading, value: clients} = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>('/clients');
    return response.data;
  });

  return (
    <div>
      <h1>Clients</h1>
      {loading && <Loader />}
      {clients?.hasErrors && <div>Error loading clients.</div>}
      {clients && !loading && clients.data?.length === 0 && (
        <div>No clients found.</div>
      )}
      {!loading && clients && (
        <ul>
          {clients.data?.map((client) => (
            <li key={client.id}>
              {client.firstName}
              {client.lastname}
              {client.dateOfBirth}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Clients;
