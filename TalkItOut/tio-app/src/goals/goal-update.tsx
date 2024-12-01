import type React from 'react';
import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../api/api';
import type {GoalGetDto, GoalUpdateDto} from '../types';
import {Button, Form, Input, SizableText, Text, YStack} from 'tamagui';

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

  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      try {
        const response = await api.get<GoalGetDto>(`/goals/${id}`);
        if (response.status === 200) {
          const {userId, information, clientId} = response.data;
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
        navigate('/goals/listing');
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
          Update Goal
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}
        {goalData && (
          <Form onSubmit={handleSubmit} style={{width: '100%'}}>
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
              <Text fontSize={18}>
                {loading ? 'Updating...' : 'Update Goal'}
              </Text>
            </Button>
          </Form>
        )}
      </YStack>
    </YStack>
  );
};

export default GoalUpdate;
