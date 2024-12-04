import {useAsync} from 'react-use';
import {YStack, Text, Button, XStack, Header} from 'tamagui';
import api from '../api/api';
import {SessionGetDto, Response} from '../types';
import {useNavigate} from 'react-router-dom';
import {formatTime} from '../components/format-date';

export const TodaySessions: React.FC = () => {
  const {loading: loadingSessions, value: sessions} = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>(
      '/sessions/todays-sessions'
    );
    return response.data;
  });
  return (
    <YStack>
      {!loadingSessions && sessions && (
        <YStack
          width="100%"
          padding={0}
          margin={0}
          gap={15}
          alignItems="center"
          overflow="scroll"
        >
          <Header width="100%" background="lightgray">
            <Text fontSize={30} fontWeight={600} justifyContent="center">
              Today's Schedule
            </Text>
          </Header>
          {sessions.data?.map((session) => {
            return <ScheduleCard session={session} />;
          })}
        </YStack>
      )}
    </YStack>
  );
};

const ScheduleCard: React.FC<{session: SessionGetDto}> = ({session}) => {
  const navigate = useNavigate();
  return (
    <XStack
      key={session.id}
      padding={15}
      borderWidth={1}
      backgroundColor="white"
      width="100%"
    >
      <XStack width="20%">
        <Text style={{color: 'black'}}>
          {formatTime(new Date(session.startTime))} -
        </Text>
        <Text style={{color: 'black'}}>
          {' '}
          {formatTime(new Date(session.endTime))}
        </Text>
      </XStack>
      <YStack width="70%">
        <Text style={{color: 'black'}} fontWeight={600}>
          {session.group.groupName}
        </Text>
        <XStack gap={5}>
          {session.group.clients.map((client) => (
            <Text style={{color: 'black'}}>
              {client.firstName} {client.lastName}
            </Text>
          ))}
        </XStack>
        <Text>{session.notes}</Text>
      </YStack>
      <XStack gap={10} width="10%">
        <Button
          size={25}
          background="#e6f2ff"
          borderRadius={4}
          onPress={() => navigate(`/sessions/${session.id}`)}
        >
          <Text style={{color: '#000', fontSize: 16}}>Session Data</Text>
        </Button>
      </XStack>
    </XStack>
  );
};
