import React from "react";
import api from "../api/api";
import { Response, SessionGetDto } from "../types";
import { useAsync } from "react-use";
import { H1, Spinner } from "tamagui";

export const Sessions: React.FC = () => {
  const { loading, value: sessions } = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>("/sessions");
    return response.data;
  });

  return (
    <div>
      <H1>Sessions</H1>
      {loading && <Spinner />}
      {sessions?.hasErrors && <div>Error loading sessions.</div>}
      {sessions && !loading && sessions.data == null && (
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
