import type React from "react";
import api from "../api/api";
import type {
  ClientGetDto,
  GroupGetDto,
  Response,
  SessionGetDto,
} from "../types";
import { useAsync } from "react-use";
import { H1, Spinner } from "tamagui";
import formatDate from "../components/format-date";

export const Sessions: React.FC = () => {
  const { loading, value: sessions } = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>("/sessions");
    return response.data;
  });

  const { loading: loadingClients, value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  const clientMap = clients?.data?.reduce<Record<number, ClientGetDto>>(
    (map, client) => {
      map[client.id] = client;
      return map;
    },
    {}
  );

  const { loading: loadingGroups, value: groups } = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>("/groups");
    return response.data;
  });

  const groupMap = groups?.data?.reduce<Record<number, GroupGetDto>>(
    (map, group) => {
      map[group.id] = group;
      return map;
    },
    {}
  );

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
          {sessions.data?.map((session) => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const durationMinutes = Math.floor(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60)
            );

            return (
              <li key={session.id}>
                <div>Session Id: {session.id}</div>
                <div>Duration: {durationMinutes} minutes</div>
                <div>Start Time: {formatDate(startTime)}</div>
                <div>End Time: {formatDate(endTime)}</div>
                <div>
                  {session.groupId
                    ? !loadingGroups &&
                      `Group: ${
                        groupMap?.[session.groupId]?.groupName ||
                        "Group not found"
                      }`
                    : session.clientId && clientMap?.[session.clientId]
                    ? !loadingClients &&
                      `Client: ${clientMap[session.clientId].firstName} ${
                        clientMap[session.clientId].lastName
                      }`
                    : "Client not found"}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Sessions;
