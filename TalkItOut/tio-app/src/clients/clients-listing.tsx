import type React from "react";
import api from "../api/api";
import type { Response, ClientGetDto } from "../types";
import { useAsync } from "react-use";
import { Button, Spinner, YStack, SizableText, Text, XStack } from "tamagui";
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
    <YStack>
      <SizableText size={50} color="#e6f2ff">
        Clients
      </SizableText>
      <Button
        size={30}
        background="#e6f2ff"
        borderRadius={4}
        onPress={() => navigate("/clients/create")}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>Create A Client</Text>
      </Button>
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
        <YStack
          width="100%"
          padding={0}
          margin={0}
          gap={15}
          alignItems="center"
        >
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
              <Text style={{ color: "black" }}>
                Name: {client.firstName} {client.lastName}
              </Text>
              <XStack>
                <Button
                  size={25}
                  background="#e6f2ff"
                  borderRadius={4}
                  onPress={() => navigate(`/clients/${client.id}`)}
                >
                  <Text style={{ color: "#000", fontSize: 16 }}>
                    Update Client
                  </Text>
                </Button>
                <Button
                  size={25}
                  background="#b32d00"
                  borderRadius={4}
                  onPress={() => handleDeleteClient(client.id)}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Delete Client
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

export default Clients;
