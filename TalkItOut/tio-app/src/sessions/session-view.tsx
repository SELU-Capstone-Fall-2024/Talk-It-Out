import type React from 'react';
import api from '../api/api';
import {useAsync} from 'react-use';
import {
  Button,
  YStack,
  SizableText,
  Spinner,
  Text,
  XStack,
  View,
} from 'tamagui';
import {formatSessionTime} from '../components/format-date';
import {useNavigate, useParams} from 'react-router-dom';
import type {SessionGetDto, Response} from '../types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

export const SessionView: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const {loading: loadingSession, value: session} = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto>>(`/sessions/${id}`);
    console.log(response.data.data);
    return response.data.data;
  }, []);

  const handleDeleteSession = async (sessionId: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await api.delete(`/sessions/${sessionId}`);
        navigate('/home');
      } catch (error) {
        console.error('Failed to delete session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${goalId}`);
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete goal:', error);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  const startTime = session ? new Date(session.startTime) : null;
  const endTime = session ? new Date(session.endTime) : null;
  let durationMinutes = 0;
  if (startTime && endTime) {
    durationMinutes = Math.floor(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
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
          Session Details
        </SizableText>
        <Button
          size={30}
          style={{background: '#282e67'}}
          borderRadius={4}
          onPress={() => navigate('/home')}
        >
          <Text color="white">Back</Text>
        </Button>
      </XStack>

      {loadingSession && <Spinner color="black" size="large" />}
      {session && !loadingSession && (
        <YStack
          width="100%"
          padding={20}
          borderWidth={1}
          borderColor="gray"
          backgroundColor="white"
          borderRadius={8}
          marginBottom={20}
        >
          <SizableText size={20} color="black">
            {startTime && endTime
              ? formatSessionTime(
                  startTime.toISOString(),
                  endTime.toISOString()
                )
              : ''}
          </SizableText>
          <SizableText size={20} color="black">
            {durationMinutes} minutes
          </SizableText>

          <Text style={{color: 'black', marginTop: 10}}>
            Clients in this session:
          </Text>
          <YStack gap={10}>
            {session.group.clients?.map((client) => (
              <YStack
                key={client.id}
                padding={10}
                borderWidth={1}
                borderColor="gray"
                background="#f0f0f0"
                borderRadius={8}
                position="relative"
              >
                <YStack alignItems="flex-start">
                  <Text color="black">
                    {client.firstName} {client.lastName}
                  </Text>
                </YStack>

                <YStack gap={5} paddingTop={10}>
                  <Text color="black" fontSize={16} fontWeight="bold">
                    Goals:
                  </Text>
                  {client.goals.map((goal) => (
                    <YStack
                      key={goal.id}
                      padding={10}
                      borderWidth={1}
                      borderColor="gray"
                      background="#e0e0e0"
                      borderRadius={8}
                    >
                      <Text color="black">{goal.information}</Text>
                      <XStack
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        gap={8}
                        padding={4}
                      >
                        <YStack alignItems="flex-end">
                          <Button
                            size={30}
                            style={{background: '#e0e0e0'}}
                            borderRadius={4}
                            onPress={() => navigate(`/goals/${goal.id}`)}
                          >
                            <Text color="black">...</Text>
                          </Button>
                        </YStack>
                        <YStack alignItems="flex-end">
                          <Button
                            size={30}
                            style={{background: '#e0e0e0'}}
                            borderRadius={4}
                            onPress={() => handleDeleteGoal(goal.id)}
                          >
                            <FontAwesomeIcon color="#b32d00" icon={faTrash} />
                          </Button>
                        </YStack>
                      </XStack>
                    </YStack>
                  ))}
                </YStack>
                <YStack alignItems="flex-end" marginTop={20}>
                  <Button
                    size={30}
                    style={{
                      background: '#282e67',
                      bottom: 10,
                      right: 10,
                    }}
                    borderRadius={4}
                    onPress={() => navigate(`/goals/create/${client.id}`)}
                  >
                    <Text color="white">Add a Goal</Text>
                  </Button>
                </YStack>
              </YStack>
            ))}
          </YStack>

          <XStack gap={10} marginTop={20}>
            <Button
              size={30}
              style={{background: '#282e67'}}
              borderRadius={4}
              onPress={() => navigate(`/sessions/${session.id}`)}
            >
              <Text color="white">Edit Session</Text>
            </Button>
            <Button
              size={30}
              style={{background: '#b32d00'}}
              borderRadius={4}
              onPress={() => handleDeleteSession(session.id)}
            >
              <Text color="white">Delete Session</Text>
            </Button>
          </XStack>
        </YStack>
      )}
    </View>
  );
};

export default SessionView;
