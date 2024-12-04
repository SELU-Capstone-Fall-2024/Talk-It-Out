import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import type {
  ClientGetDto,
  GoalGetDto,
  GoalUpdateDto,
  Response,
} from "../types";
import {
  Button,
  Form,
  Input,
  SizableText,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

const GoalUpdate: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const [goalData, setGoalData] = useState<GoalUpdateDto>({
    userId: 1,
    information: '',
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<ClientGetDto | null>(null);
  const [loadingClient, setLoadingClient] = useState(false);

  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      try {
        const response = await api.get<Response<GoalGetDto>>(`/goals/${id}`);
        if (response.status === 200 && response.data.data) {
          const { userId, information, clientId } = response.data.data;
          setGoalData({
            userId: userId,
            information: information,
            clientId: clientId,
          });
        } else {
          setError('Failed to load goal.');
        }
      } catch (err) {
        setError('An error occurred while loading the goal.');
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

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

  const handleChange = (field: keyof GoalUpdateDto) => (value: string) => {
    setGoalData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      if (response.status === 200) {
        navigate(`/clients/${goalData.clientId}/view`);
      } else {
        setError('Failed to update goal. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the goal.');
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
            Edit {client?.firstName} {client?.lastName}'s Goal
          </SizableText>

          <Button
            size={25}
            style={{ background: "#282e67" }}
            borderRadius={4}
            onPress={() => navigate(`/clients/${goalData.clientId}/view`)}
          >
            <Text color={"white"}>Back</Text>
          </Button>
        </XStack>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}
        {goalData && (
          <Form onSubmit={handleSubmit} style={{width: '100%'}}>
            <YStack gap={10}>
              <Input
                size={46}
                minHeight={100}
                flex={1}
                padding={4}
                value={goalData.information}
                onChangeText={(text) => handleChange("information")(text)}
                color="black"
                borderRadius={2}
                multiline
              />
            </YStack>

            <Button
              width={150}
              alignSelf="center"
              size={30}
              padding={12}
              disabled={loading}
              style={{ overflow: "hidden", background: "#282e67" }}
              onPress={handleSubmit}
              borderRadius={4}
              marginTop={20}
            >
              <Text fontSize={18} color="white">
                {loading ? <Spinner /> : "Update Goal"}
              </Text>
            </Button>
          </Form>
        )}
      </YStack>
    </YStack>
  );
};

export default GoalUpdate;
