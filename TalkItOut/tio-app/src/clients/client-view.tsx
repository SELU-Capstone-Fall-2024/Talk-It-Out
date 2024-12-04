import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
  Spinner,
} from "tamagui";
import { ClientGetDto, GoalGetDto, Response } from "../types";
import api from "../api/api";
import { formatDate } from "../components/format-date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loadingClient, setLoadingClient] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [errorClient, setErrorClient] = useState<string | null>(null);
  const [errorGoals, setErrorGoals] = useState<string | null>(null);
  const [client, setClient] = useState<ClientGetDto | null>(null);
  const [allGoals, setAllGoals] = useState<GoalGetDto[] | null>(null);
  const [filteredGoals, setFilteredGoals] = useState<GoalGetDto[]>([]);

  useEffect(() => {
    const fetchClient = async () => {
      setLoadingClient(true);
      try {
        const response = await api.get<Response<ClientGetDto>>(
          `/clients/${id}`
        );
        setClient(response.data.data);
      } catch {
        setErrorClient("Failed to load client data. Please try again.");
      } finally {
        setLoadingClient(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  useEffect(() => {
    const fetchAllGoals = async () => {
      setLoadingGoals(true);
      try {
        const response = await api.get<Response<GoalGetDto[]>>(`/goals`);
        setAllGoals(response.data.data);
      } catch {
        setErrorGoals("Failed to load goals data. Please try again.");
      } finally {
        setLoadingGoals(false);
      }
    };

    fetchAllGoals();
  }, []);

  useEffect(() => {
    if (id && Array.isArray(allGoals)) {
      const clientGoals = allGoals.filter(
        (goal) => goal.clientId === parseInt(id, 10)
      );
      setFilteredGoals(clientGoals);
    }
  }, [allGoals, id]);

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await api.delete(`/goals/${goalId}`);
        setFilteredGoals((prev) => prev.filter((goal) => goal.id !== goalId));
      } catch {
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/clients/${id}`);
        navigate("/clients/listing");
      } catch {
        alert("Failed to delete client. Please try again.");
      }
    }
  };

  return (
    <View padding={20}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginBottom={20}
      >
        <SizableText size={30} color="black">
          Client Details
        </SizableText>
        <Button
          size={30}
          style={{ background: "#282e67" }}
          onPress={() => navigate("/clients/listing")}
        >
          <Text color="white">Back</Text>
        </Button>
      </XStack>

      {loadingClient && <Spinner color="black" size="large" />}
      {errorClient && (
        <SizableText size={20} color="red">
          {errorClient}
        </SizableText>
      )}

      {client && (
        <YStack
          padding={20}
          borderWidth={1}
          borderColor="gray"
          backgroundColor="white"
          borderRadius={8}
          marginBottom={20}
        >
          <SizableText size={24} color="black">
            {client.firstName} {client.lastName}
          </SizableText>
          <Text color="black">
            Date of Birth: {formatDate(new Date(client.dateOfBirth))}
          </Text>
        </YStack>
      )}

      <YStack marginBottom={20}>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          marginBottom={10}
        >
          <SizableText size={24} color="black">
            Goals
          </SizableText>
          <Button
            size={30}
            style={{ background: "#282e67" }}
            onPress={() => navigate(`/goals/create/${id}`)}
          >
            <Text color="white">Add a Goal</Text>
          </Button>
        </XStack>

        {loadingGoals && <Spinner color="black" size="large" />}
        {errorGoals && (
          <SizableText size={20} color="red">
            {errorGoals}
          </SizableText>
        )}

        {filteredGoals.length > 0 ? (
          <YStack gap={10}>
            {filteredGoals.map((goal) => (
              <YStack
                key={goal.id}
                padding={15}
                borderWidth={1}
                borderColor="gray"
                background="#f0f0f0"
                borderRadius={8}
              >
                <Text color="black">{goal.information}</Text>
                <XStack justifyContent="flex-end" gap={10} marginTop={10}>
                  <Button
                    size={30}
                    style={{background: "#f0f0f0"}}
                    onPress={() => navigate(`/goals/${goal.id}`)}
                  >
                    <Text color="black">...</Text>
                  </Button>
                  <Button
                    size={30}
                    style={{ background: "#f0f0f0" }}
                    onPress={() => handleDeleteGoal(goal.id)}
                  >
                    <FontAwesomeIcon color="#b32d00" icon={faTrash} />
                  </Button>
                </XStack>
              </YStack>
            ))}
          </YStack>
        ) : (
          <SizableText size={20} color="black">
            No goals found for this client.
          </SizableText>
        )}
      </YStack>

      <XStack gap={10}>
        <Button
          size={30}
          style={{ background: "#282e67" }}
          onPress={() => navigate(`/clients/${id}`)}
        >
          <Text color="white">Edit Client</Text>
        </Button>
        <Button
          size={30}
          style={{ background: "#b32d00" }}
          onPress={handleDeleteClient}
        >
          <Text color="white">Delete Client</Text>
        </Button>
      </XStack>
    </View>
  );
};

export default ClientView;
