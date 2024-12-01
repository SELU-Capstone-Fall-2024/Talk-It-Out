import type React from "react";
import api from "../api/api";
import type { Response, ClientGetDto } from "../types";
import { useAsync } from "react-use";
import {
  Button,
  Spinner,
  YStack,
  SizableText,
  Text,
  XStack,
  Input,
} from "tamagui";
import { useNavigate } from "react-router-dom";

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { loading, value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  const handleDeleteClient = async (clientId: number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/clients/${clientId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete client:", error);
        alert("Failed to delete client. Please try again.");
      }
    }
  };

  return (
    <YStack padding={20}>
      <SizableText size={50} color="black" textAlign="left">
        Students
      </SizableText>

      <XStack alignItems="flex-start" marginBottom={15} gap={30}>
        <Input
          placeholder="Find a Student: Search..."
          style={{
            padding: 10,
            width: 300,
            borderRadius: 8,
            marginBottom: 20,
          }}
        />
        <Button
          size={30}
          style={{background: "#282e67"}}
          borderRadius={4}
          onPress={() => navigate("/clients/create")}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Create A Client</Text>
        </Button>
      </XStack>

      {loading && <Spinner color="#e6f2ff" size="large" />}
      {clients?.hasErrors && (
        <SizableText size={25} color="#e6f2ff">
          Error loading clients.
        </SizableText>
      )}
      {clients && !loading && clients.data?.length === 0 && (
        <SizableText size={25} color="#e6f2ff">
          No clients found.
        </SizableText>
      )}

      {!loading && clients && (
        <YStack width="100%" padding={0} gap={10}>
          <YStack
            width="100%"
            padding={10}
            borderBottomWidth={2}
            borderColor="black"
            backgroundColor="#e6f2ff"
            gap={15}
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize={18} color="black">
              Name
            </Text>
            <Text fontSize={18} color="black">
              Date of Birth
            </Text>
            <Text fontSize={18} color="black">
              Actions
            </Text>
          </YStack>

          {clients.data?.map((client) => (
            <YStack
              key={client.id}
              padding={15}
              borderWidth={1}
              borderColor="black"
              backgroundColor="white"
              width="100%"
              gap={10}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Text style={{ color: "black" }}>
                  {client.firstName} {client.lastName}
                </Text>
                <Text style={{ color: "black" }}>{client.dateOfBirth}</Text>
                <XStack gap={10}>
                  <Button
                    size={25}
                    background="#e6f2ff"
                    borderRadius={4}
                    onPress={() => navigate(`/clients/${client.id}`)}
                  >
                    <Text style={{ color: "#000", fontSize: 16 }}>View</Text>
                  </Button>
                  <Button
                    size={25}
                    background="#b32d00"
                    borderRadius={4}
                    onPress={() => handleDeleteClient(client.id)}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>Delete</Text>
                  </Button>
                </XStack>
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
};

export default Clients;
