import type React from "react";
import { useEffect, useState } from "react";
import api from "../api/api";
import type { ClientGetDto, GoalCreateDto, Response } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import {
  YStack,
  SizableText,
  Button,
  Input,
  Text,
  Form,
  XStack,
  View,
  Spinner,
} from "tamagui";

const GoalCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const parsedClientId = clientId ? parseInt(clientId, 10) : null;
  const [goalData, setGoalData] = useState<GoalCreateDto>({
    userId: 1,
    information: "",
    clientId: parsedClientId || 0,
  });
  const [client, setClient] = useState<ClientGetDto | null>(null);
  const [loadingClient, setLoadingClient] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const response = await api.get<Response<ClientGetDto>>(
          `/clients/${goalData.clientId}`
        );
        setClient(response.data.data);
      } catch (err) {
        console.error("Failed to load client data:", err);
      } finally {
        setLoadingClient(false);
      }
    };

    if (goalData.clientId) {
      fetchClient();
    }
  }, [goalData.clientId]);

  const handleSubmit = async () => {
    if (!goalData.information) {
      setError("Goal information cannot be empty.");
      return;
    }
    if (!parsedClientId) {
      setError("Invalid or missing client ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/goals', goalData);
      if (response.status === 201) {
        navigate(`/clients/${clientId}/view`);
      } else {
        setError('Failed to create goal. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="flex-start"
      alignItems="center"
      padding={20}
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={500}
        padding={30}
        borderRadius={15}
        alignItems="center"
      >
        <XStack alignItems="center" justifyContent="space-between" width="100%">
          <SizableText size={30} marginBottom={20} color="black">
            Create a Goal for {client?.firstName} {client?.lastName}
          </SizableText>

          <Button
            size={25}
            style={{ background: "#282e67" }}
            borderRadius={4}
            onPress={() => navigate(`/clients/${clientId}/view`)}
          >
            <Text color={"white"}>Back</Text>
          </Button>
        </XStack>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <Input
              size={46}
              minHeight={100}
              value={goalData.information}
              onChangeText={(value) =>
                setGoalData((prev) => ({ ...prev, information: value }))
              }
              placeholder="Enter goal information..."
              placeholderTextColor="#b0b0b0"
              color="black"
              borderRadius={2}
              multiline
            />
          </YStack>

          <Button
            width={150}
            alignSelf="center"
            size={30}
            disabled={loading}
            style={{ overflow: "hidden", background: "#282e67" }}
            onPress={handleSubmit}
            borderRadius={4}
            marginTop={10}
          >
            <Text fontSize={18} color={"white"}>
              {loading ? <Spinner /> : "Create Goal"}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default GoalCreate;
