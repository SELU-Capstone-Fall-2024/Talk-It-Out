import type React from "react";
import api from "../api/api";
import type { Response, GroupGetDto, ClientGetDto } from "../types";
import { useAsync } from "react-use";
import { Button, Spinner, YStack, SizableText, Text, XStack } from "tamagui";
import { useNavigate } from "react-router-dom";

const Groups: React.FC = () => {
  const navigate = useNavigate();
  const { loading: loadingGroups, value: groups } = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>("/groups");
    return response.data;
  });
  const { loading: loadingClients, value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  const handleDeleteGroup = async (groupId: number) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await api.delete(`/groups/${groupId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete group:", error);
        alert("Failed to delete group. Please try again.");
      }
    }
  };

  if (loadingGroups || loadingClients)
    return <Spinner color="#e6f2ff" size="large" />;
  if (groups?.hasErrors)
    return (
      <SizableText size={25} color="#e6f2ff">
        Error loading groups.
      </SizableText>
    );
  if (clients?.hasErrors)
    return (
      <SizableText size={25} color="#e6f2ff">
        Error loading clients.
      </SizableText>
    );

  const clientMap = clients?.data?.reduce<Record<number, ClientGetDto>>(
    (map, client) => {
      map[client.id] = client;
      return map;
    },
    {}
  );

  return (
    <YStack>
      <SizableText size={50} color="#e6f2ff">
        Groups
      </SizableText>
      <Button
        size={30}
        width={150}
        background="#e6f2ff"
        borderRadius={4}
        onPress={() => navigate("/groups/create")}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>Create A Group</Text>
      </Button>
      {groups && !loadingGroups && groups.data?.length === 0 && (
        <SizableText size={25} color="#e6f2ff">
          No groups found.
        </SizableText>
      )}
      {!loadingGroups && groups && (
        <YStack
          width="100%"
          padding={0}
          margin={0}
          gap={15}
          alignItems="center"
        >
          {groups.data?.map((group) => (
            <YStack
              key={group.id}
              padding={15}
              borderWidth={1}
              borderColor="black"
              backgroundColor="white"
              width="100%"
              gap={10}
            >
              <Text style={{ color: "black" }}>
                Group Name: {group.groupName}
              </Text>
              <YStack paddingLeft={10}>
                {group.clientIds?.map((clientId) => {
                  const client = clientMap?.[clientId];
                  return (
                    <Text key={clientId} style={{ color: "black" }}>
                      {client
                        ? `${client.firstName} ${client.lastName} - ${client.dateOfBirth}`
                        : "Client not found"}
                    </Text>
                  );
                })}
              </YStack>
              <XStack gap={10}>
                <Button
                  size={25}
                  background="#e6f2ff"
                  borderRadius={4}
                  onPress={() => navigate(`/groups/${group.id}`)}
                >
                  <Text style={{ color: "#000", fontSize: 16 }}>
                    Update Group
                  </Text>
                </Button>
                <Button
                  size={25}
                  marginLeft={90}
                  background="#b32d00"
                  borderRadius={4}
                  onPress={() => handleDeleteGroup(group.id)}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Delete Group
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
};

export default Groups;
