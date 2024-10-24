import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import type { GoalGetDto, GoalUpdateDto } from "../types";
import {
  Button,
  Form,
  Input,
  Select,
  SizableText,
  Text,
  TextArea,
  YStack,
} from "tamagui";

const GoalUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [goalData, setGoalData] = useState<GoalUpdateDto>({
    userId: 1,
    information: "",
    clientId: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      try {
        const response = await api.get<GoalGetDto>(`/goals/${id}`);
        if (response.status === 200) {
          const { userId, information, clientId } = response.data;
          setGoalData({
            userId: userId,
            information: information,
            clientId: clientId,
          });
        } else {
          setError("Failed to load goal.");
        }
      } catch (err) {
        setError("An error occurred while loading the goal.");
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleChange =
    (field: keyof GoalUpdateDto) => (value: string | number) => {
      setGoalData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };
  console.log("goaldata.information =", goalData.information);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      if (response.status === 200) {
        navigate("/goals");
      } else {
        setError("Failed to update goal. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the goal.");
    } finally {
      setLoading(false);
    }
  };

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
      <YStack
        width="100%"
        maxWidth={400}
        padding={30}
        borderRadius={15}
        backgroundColor="$darkPrimary"
        shadowColor="rgba(0, 0, 0, 0.5)"
        shadowRadius={10}
        shadowOpacity={0.5}
        shadowOffset={{ width: 0, height: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Update Goal
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}
        {goalData && (
          <Form onSubmit={() => handleSubmit} style={{ width: "100%" }}>
            <YStack gap={20}>
              <SizableText size={18} color="#e6f2ff">
                Goal Information
              </SizableText>
              <TextArea
                size={46}
                flex={1}
                padding={4}
                defaultValue={goalData.information}
                onChange={() => handleChange("information")}
                borderColor="#cce6ff"
                background="#3d444d"
                borderRadius={2}
                placeholderTextColor="#e6f2ff"
              />
            </YStack>

            <Button
              width={150}
              alignSelf="center"
              size={30}
              padding={12}
              disabled={loading}
              background="#e6f2ff"
              style={{ overflow: "hidden", textAlign: "center" }}
              marginTop={20}
            >
              <Text fontSize={18}>
                {loading ? "Updating..." : "Update Goal"}
              </Text>
            </Button>
          </Form>
        )}
      </YStack>
    </YStack>
  );
};

export default GoalUpdate;
