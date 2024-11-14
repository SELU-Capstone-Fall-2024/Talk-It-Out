import type React from "react";
import api from "../api/api";
import type {
  ClientGetDto,
  GroupGetDto,
  Response,
  SessionGetDto,
} from "../types";
import { useAsync } from "react-use";
import { Button, YStack, SizableText, Spinner, Text, XStack } from "tamagui";
import formatDate from "../components/format-date";
import { useNavigate } from "react-router-dom";

export const Sessions: React.FC = () => {
  const { loading: loadingSessions, value: sessions } = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>("/sessions");
    return response.data;
  });

  const { loading: loadingClients, value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  const { loading: loadingGroups, value: groups } = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>("/groups");
    return response.data;
  });

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      try {
        await api.delete(`/sessions/${sessionId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete session:", error);
        alert("Failed to delete session. Please try again.");
      }
    }
  };

  const navigate = useNavigate();

  const clientMap = clients?.data?.reduce<Record<number, ClientGetDto>>(
    (map, client) => {
      map[client.id] = client;
      return map;
    },
    {}
  );

  const groupMap = groups?.data?.reduce<Record<number, GroupGetDto>>(
    (map, group) => {
      map[group.id] = group;
      return map;
    },
    {}
  );

  return (
    <YStack>
      <SizableText size={50} color="#e6f2ff">
        Sessions
      </SizableText>
      <Button
        size={30}
        background="#e6f2ff"
        borderRadius={4}
        onPress={() => navigate("/sessions/create")}
        width={175}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>Create A Session</Text>
      </Button>
      {loadingSessions && <Spinner color="#e6f2ff" size="large" />}
      {sessions?.hasErrors && (
        <SizableText size={25} color="#e6f2ff">
          Error loading sessions.
        </SizableText>
      )}
      {sessions && !loadingSessions && sessions.data?.length === 0 && (
        <SizableText size={25} color="#e6f2ff">
          No sessions found.
        </SizableText>
      )}
      {!loadingSessions && sessions && (
        <YStack
          width="100%"
          padding={0}
          margin={0}
          gap={15}
          alignItems="center"
          overflow="scroll"
        >
          {sessions.data?.map((session) => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const durationMinutes = Math.floor(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60)
            );
            const client = session.clientId
              ? clientMap?.[session.clientId]
              : null;
            const group = session.groupId ? groupMap?.[session.groupId] : null;

            return (
              <YStack
                key={session.id}
                padding={15}
                borderWidth={1}
                borderColor="black"
                backgroundColor="white"
                width="100%"
                gap={10}
              >
                <Text style={{ color: "black" }}>Session Id: {session.id}</Text>
                <Text style={{ color: "black" }}>
                  Duration: {durationMinutes} minutes
                </Text>
                <Text style={{ color: "black" }}>
                  Start Time: {formatDate(startTime)}
                </Text>
                <Text style={{ color: "black" }}>
                  End Time: {formatDate(endTime)}
                </Text>
                <Text style={{ color: "black" }}>
                  {group
                    ? `Group: ${group.groupName}`
                    : client
                    ? `Client: ${client.firstName} ${client.lastName}`
                    : "Client or group not found"}
                </Text>
                <XStack gap={10}>
                  <Button
                    size={25}
                    background="#e6f2ff"
                    borderRadius={4}
                    onPress={() => navigate(`/sessions/${session.id}`)}
                  >
                    <Text style={{ color: "#000", fontSize: 16 }}>
                      Edit Session
                    </Text>
                  </Button>
                  <Button
                    size={25}
                    background="#b32d00"
                    borderRadius={4}
                    onPress={() => handleDeleteSession(session.id)}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      Delete Session
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            );
          })}
        </YStack>
      )}
    </YStack>
  );
};

export default Sessions;
