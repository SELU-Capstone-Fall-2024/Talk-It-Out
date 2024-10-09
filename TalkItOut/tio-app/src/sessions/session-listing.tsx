import React from 'react';
import api from '../api/api';
import {Response, SessionGetDto} from '../types';
import {useAsync} from 'react-use';
import Loader from '../components/loader';

const Sessions: React.FC = () => {
  const {loading, value: sessions} = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>('/sessions');
    return response.data;
  });

  return (
    <div>
      <h1>Sessions</h1>
      {loading && <Loader />}
      {sessions?.hasErrors && <div>Error loading sessions.</div>}
      {sessions && !loading && sessions.data?.length === 0 && (
        <div>No sessions found.</div>
      )}
      {!loading && sessions && (
        <ul>
          {sessions.data?.map((session) => (
            <li key={session.id}>
              {session.userId}
              {session.durationMinutes}
              {session.startTime}
              {session.endTime}
              {session.groupId}
              {session.clientId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Sessions;
