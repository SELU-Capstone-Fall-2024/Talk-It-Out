import type React from "react";
import api from "../api/api";
import type { Response, GoalGetDto } from "../types";
import { useAsync } from "react-use";
import { Button, Spinner, YStack, Text, SizableText, XStack } from "tamagui";
import { useNavigate } from "react-router-dom";

const Goals: React.FC = () => {
  const navigate = useNavigate();

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

  const {
    loading,
    value: goals,
    error: fetchError,
  } = useAsync(async () => {
    const response = await api.get<Response<GoalGetDto[]>>("/goals");
    return response.data;
  });

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      background="$darkBackground"
      minHeight="100vh"
      width="100vw"
    >
      {" "}
      <XStack marginTop={-200} alignItems="center" gap={650} width="600">
        <SizableText size={50} color="#e6f2ff">
          Goals
        </SizableText>
        <Button
          size={30}
          background="#e6f2ff"
          borderRadius={4}
          onPress={() => navigate("/goals/create")}
        >
          <Text color="#000" fontSize={18}>
            Create A Goal
          </Text>
        </Button>
      </XStack>
      <YStack
        width="100%"
        maxWidth={1000}
        padding={30}
        borderRadius={15}
        backgroundColor="$darkPrimary"
        alignItems="center"
        justifyContent="center"
      >
        {loading && <Spinner color="#e6f2ff" size="large" />}

        {fetchError && (
          <Text color="red" marginBottom={20}>
            Error loading goals.
          </Text>
        )}

        {!loading && goals?.data?.length === 0 && (
          <Text color="#e6f2ff" marginBottom={20}>
            No goals found.
          </Text>
        )}

        {!loading && goals && goals.data && goals.data.length > 0 && (
          <YStack
            width="100%"
            padding={0}
            margin={0}
            gap={15}
            alignItems="center"
          >
            {goals.data.map((goal) => (
              <YStack
                key={goal.id}
                padding={15}
                borderWidth={1}
                borderColor="#cce6ff"
                background="#3d444d"
                borderRadius={8}
                width="100%"
                shadowColor="rgba(0, 0, 0, 0.2)"
                shadowRadius={5}
                shadowOpacity={0.3}
                shadowOffset={{ width: 0, height: 2 }}
                gap={10}
              >
                <SizableText size={20} color="#e6f2ff">
                  Goal ID: {goal.id}
                </SizableText>
                <Text color="#cce6ff">
                  Created By: {goal.createdByUserName}
                </Text>
                <Text color="#cce6ff">
                  Client: {goal.clientFirstName} {goal.clientLastName}
                </Text>
                <Text color="#cce6ff">
                  Goal Information: {goal.information}
                </Text>

                <Button
                  size={25}
                  background="#e6f2ff"
                  borderRadius={4}
                  onPress={() => navigate(`/goals/${goal.id}`)}
                >
                  <Text color="#000" fontSize={16}>
                    Update Goal
                  </Text>
                </Button>
                <Button
                  size={25}
                  background="white"
                  borderRadius={4}
                  onPress={() => handleDeleteGoal(goal.id)}
                >
                  <Text color="black" fontSize={16}>
                    Delete Goal
                  </Text>
                </Button>
              </YStack>
            ))}
          </YStack>
        )}
      </YStack>
    </YStack>
  );
};

export default Goals;
