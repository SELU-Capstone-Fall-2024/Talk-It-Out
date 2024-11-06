import type React from "react";
import api from "../api/api";
import type { Response, GroupGetDto, ClientGetDto } from "../types";
import { useAsync } from "react-use";
import { Spinner } from "tamagui";

const Groups: React.FC = () => {
  const { loading: loadingGroups, value: groups } = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>("/groups");
    console.log(response.data);
    return response.data;
  });

  const { loading: loadingClients, value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  if (loadingGroups || loadingClients) return <Spinner />;
  if (groups?.hasErrors) return <div>Error loading groups.</div>;
  if (clients?.hasErrors) return <div>Error loading clients.</div>;

  // Create a lookup map for clients by ID for efficient retrieval
  const clientMap = clients?.data?.reduce<Record<number, ClientGetDto>>(
    (map, client) => {
      map[client.id] = client;
      return map;
    },
    {}
  );

  return (
    <div>
      <h1>Groups</h1>
      {groups && groups.data?.length === 0 && <div>No groups found.</div>}
      {groups && (
        <ul>
          {groups.data?.map((group) => (
            <li key={group.id}>
              <strong>Group Name: {group.groupName}</strong>
              <ul>
                {group.clientIds?.map((clientId) => {
                  const client = clientMap?.[clientId];
                  return (
                    <li key={clientId}>
                      {client
                        ? `${client.firstName} ${client.lastName} - ${client.dateOfBirth}`
                        : "Client not found"}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Groups;
