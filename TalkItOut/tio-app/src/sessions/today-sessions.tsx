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
          margin={5}
          gap={15}
          alignItems="center"
        >
          <Header width="90%" background="lightgray">
            <Text fontSize={30} fontWeight={600} justifyContent="center">
              Today's Schedule
            </Text>
          </Header>
          {sessions.data?.map((session) => {
            return <ScheduleCard session={session} key={session.id} />;
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
      width="90%"
    >
      <XStack width="20%">
        <Text style={{color: 'black'}} fontSize={20}>
          {formatTime(new Date(session.startTime))} -
        </Text>
        <Text style={{color: 'black'}} fontSize={20}>
          {' '}
          {formatTime(new Date(session.endTime))}
        </Text>
      </XStack>
      <YStack width="70%">
        <Text style={{color: 'black'}} fontWeight={600} fontSize={20}>
          <Text fontSize={20}>Group: </Text>
          {session.group.groupName}
        </Text>
        <XStack gap={5}>
          <Text fontSize={20}>Clients:</Text>
          {session.group.clients.length === 1 ? (
            <>
              {session.group.clients.map((client) => (
                <>
                  <Text style={{color: 'black'}} key={client.id} fontSize={20}>
                    {client.firstName} {client.lastName}
                  </Text>
                </>
              ))}
            </>
          ) : (
            <>
              {session.group.clients
                .filter(
                  (_, index) => index !== session.group.clients.length - 1
                )
                .map((client) => (
                  <>
                    <Text
                      style={{color: 'black'}}
                      key={client.id}
                      fontSize={20}
                    >
                      {client.firstName} {client.lastName},
                    </Text>
                  </>
                ))}
              {session.group.clients
                .filter(
                  (_, index) => index === session.group.clients.length - 1
                )
                .map((client) => (
                  <>
                    <Text
                      style={{color: 'black'}}
                      key={client.id}
                      fontSize={20}
                    >
                      & {client.firstName} {client.lastName}
                    </Text>
                  </>
                ))}
            </>
          )}
        </XStack>
        <XStack>
          <Text fontSize={20}>Notes: </Text>
          <Text fontSize={20}> {session.notes}</Text>
        </XStack>
      </YStack>
      <XStack gap={20} width="10%">
        <Button
          size={35}
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
