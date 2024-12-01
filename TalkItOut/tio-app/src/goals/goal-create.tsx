import type React from 'react';
import {useState} from 'react';
import api from '../api/api';
import type {GoalCreateDto} from '../types';
import {useNavigate} from 'react-router-dom';
import {YStack, SizableText, Button, Input, Text, Form} from 'tamagui';

const GoalCreate: React.FC = () => {
  const navigate = useNavigate();
  const [goalData, setGoalData] = useState<GoalCreateDto>({
    userId: 1,
    information: '',
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof GoalCreateDto) => (value: string | number) => {
      setGoalData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleIdChange = (value: string) => {
    const parsedId = Number.parseInt(value);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError('Please enter a valid Client ID.');
      setGoalData((prevData) => ({
        ...prevData,
        clientId: 0,
      }));
    } else {
      setGoalData((prevData) => ({
        ...prevData,
        clientId: parsedId,
      }));
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (
      goalData.userId === 0 ||
      !goalData.information ||
      goalData.clientId === 0
    ) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/goals', goalData);
      if (response.status === 201) {
        navigate('/goals/listing');
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
      justifyContent="center"
      alignItems="center"
      padding={20}
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding={30}
        borderRadius={15}
        backgroundColor="$darkPrimary"
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Create Goal
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Client ID
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={goalData.clientId.toString()}
              onChangeText={(text) => handleIdChange(text)}
              placeholder="Enter Client ID"
              placeholderTextColor="gray"
              color="black"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Goal Information
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={goalData.information}
              onChangeText={(text) => handleChange('information')(text)}
              placeholder="Enter goal information"
              placeholderTextColor="gray"
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
            style={{overflow: 'hidden'}}
            onPress={handleSubmit}
            borderRadius={4}
            marginTop={20}
          >
            <Text fontSize={18}>{loading ? 'Creating...' : 'Create Goal'}</Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default GoalCreate;
