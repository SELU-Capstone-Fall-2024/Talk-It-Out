import React from 'react';
import api from '../api/api';
import {Response, GroupGetDto, ClientGetDto} from '../types';
import {useAsync} from 'react-use';
import Loader from '../components/loader';

const Groups: React.FC = () => {
  const {loading, value: groups} = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>('/groups');
    return response.data;
  });

  return (
    <div>
      <h1>Groups</h1>
      {loading && <Loader />}
      {groups?.hasErrors && <div>Error loading groups.</div>}
      {groups && !loading && groups.data?.length === 0 && (
        <div>No groups found.</div>
      )}
      {!loading && groups && (
        <ul>
        {groups.data?.map((group) => (
          <li key={group.id}>
            <strong>Group ID: {group.id}</strong>
            <ul>
              {/* Map through clients and display relevant info */}
              {group.clients?.map((client: ClientGetDto) => (
                <li key={client.id}>
                  {client.firstName}
                  {client.lastname}
                  {client.dateOfBirth}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};
export default Groups;
