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
      setErrorClient(null);
      try {
        const response = await api.get<Response<ClientGetDto>>(
          `/clients/${id}`
        );
        setClient(response.data.data);
      } catch (err) {
        console.error("Failed to load client data:", err);
        setErrorClient("Failed to load client data. Please try again.");
      } finally {
        setLoadingClient(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]);

  useEffect(() => {
    const fetchAllGoals = async () => {
      setLoadingGoals(true);
      setErrorGoals(null);
      try {
        const response = await api.get<Response<GoalGetDto[]>>(`/goals`);
        setAllGoals(response.data.data);
      } catch (err) {
        console.error("Failed to load goals data:", err);
        setErrorGoals("Failed to load client goals. Please try again.");
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
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete goal:", error);
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/clients/${id}`);
        navigate("/clients/listing");
      } catch (error) {
        console.error("Failed to delete client:", error);
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  if (loadingClient) {
    return (
      <View padding={20}>
        <SizableText size={25} color="black">
          Loading client details...
        </SizableText>
      </View>
    );
  }

  if (errorClient) {
    return (
      <View padding={20}>
        <SizableText size={25} color="red">
          {errorClient}
        </SizableText>
        <Button
          size={30}
          style={{ background: "#282e67", marginTop: 20 }}
          borderRadius={4}
          onPress={() => navigate("/clients/listing")}
        >
          <Text color="white">Back</Text>
        </Button>
      </View>
    );
  }

  return (
    <View padding={20}>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        marginBottom={20}
      >
        <SizableText size={30} color="black">
          Client Details
        </SizableText>
        <Button
          size={30}
          style={{ background: "#282e67" }}
          borderRadius={4}
          onPress={() => navigate("/clients/listing")}
        >
          <Text color="white">Back</Text>
        </Button>
      </XStack>
      {client && (
        <View marginBottom={20}>
          <SizableText size={24} color="black">
            Name: {client.firstName} {client.lastName}
          </SizableText>
          <SizableText size={18} color="black" marginTop={10}>
            Date of Birth: {formatDate(new Date(client.dateOfBirth))}
          </SizableText>
        </View>
      )}
      <YStack maxWidth={800}>
        <XStack alignItems="center" gap={20} justifyContent="space-between">
          <SizableText size={30} color="black" marginBottom={10}>
            Goals
          </SizableText>
          <Button
            size={30}
            style={{ background: "#282e67" }}
            borderRadius={4}
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
        {filteredGoals && filteredGoals.length > 0 ? (
          <YStack gap={15}>
            {filteredGoals.map((goal) => (
              <XStack
                key={goal.id}
                borderWidth={1}
                borderColor="gray"
                background="#f0f0f0"
                borderRadius={10}
                width="100%"
                padding={15}
              >
                <YStack width="90%" gap={10}>
                  <Text color="black" fontSize={18}>
                    {goal.information}
                  </Text>
                </YStack>
                <XStack width="10%" gap={6} justifyContent="space-between">
                  <YStack alignItems="flex-end">
                    <Button
                      size={30}
                      style={{ background: "#f0f0f0" }}
                      borderRadius={4}
                      onPress={() => navigate(`/goals/${goal.id}`)}
                    >
                      <Text color="black">...</Text>
                    </Button>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <Button
                      size={30}
                      style={{ background: "#f0f0f0" }}
                      borderRadius={4}
                      onPress={() => handleDeleteGoal(goal.id)}
                    >
                      <FontAwesomeIcon color="#b32d00" icon={faTrash} />
                    </Button>
                  </YStack>
                </XStack>
              </XStack>
            ))}
          </YStack>
        ) : (
          !loadingGoals && (
            <SizableText size={20} color="black">
              No goals found for this client.
            </SizableText>
          )
        )}
      </YStack>
      <XStack alignItems="flex-start" marginTop={20}>
        <Button
          size={30}
          style={{ background: "#282e67" }}
          borderRadius={4}
          onPress={() => navigate(`/clients/${id}`)}
          marginRight={20}
        >
          <Text color={"white"}>Edit Client</Text>
        </Button>

        <Button
          size={30}
          style={{ background: "#b32d00" }}
          borderRadius={4}
          onPress={() => handleDeleteClient(id ?? "")}
        >
          <Text color={"white"}>Delete Client</Text>
        </Button>
      </XStack>
    </View>
  );
};

export default ClientView;
