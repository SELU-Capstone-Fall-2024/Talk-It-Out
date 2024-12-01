import {useAsync} from 'react-use';
import {YStack, Text, Button, XStack} from 'tamagui';
import api from '../api/api';
import {SessionGetDto, Response} from '../types';
import formatDate from '../components/format-date';
import {useNavigate} from 'react-router-dom';

export const TodaySessions: React.FC = () => {
  const navigate = useNavigate();

  const {loading: loadingSessions, value: sessions} = useAsync(async () => {
    const response = await api.get<Response<SessionGetDto[]>>('/sessions');
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
          {sessions.data?.map((session) => {
            const startTime = new Date(session.startTime);
            const endTime = new Date(session.endTime);
            const durationMinutes = Math.floor(
              (endTime.getTime() - startTime.getTime()) / (1000 * 60)
            );

            return (
              <YStack
                key={session.id}
                padding={15}
                borderWidth={1}
                borderColor="black"
                backgroundColor="white"
                width="100%"
                gap={10}
              >
                <Text style={{color: 'black'}}>Session Id: {session.id}</Text>
                <Text style={{color: 'black'}}>
                  Duration: {durationMinutes} minutes
                </Text>
                <Text style={{color: 'black'}}>
                  Start Time: {formatDate(startTime)}
                </Text>
                <Text style={{color: 'black'}}>
                  End Time: {formatDate(endTime)}
                </Text>

                <XStack gap={10}>
                  <Button
                    size={25}
                    background="#e6f2ff"
                    borderRadius={4}
                    onPress={() => navigate(`/sessions/${session.id}`)}
                  >
                    <Text style={{color: '#000', fontSize: 16}}>
                      Edit Session
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            );
          })}
        </YStack>
      )}
    </YStack>
  );
};
