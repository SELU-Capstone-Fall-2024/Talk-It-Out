import {
  Dialog,
  DialogPortal,
  YStack,
  SizableText,
  XStack,
  Text,
  Button,
  Form,
  Input,
} from 'tamagui';
import {
  ClientGetDto,
  GoalGetDto,
  SessionGetDto,
  SessionGoalCreateDto,
} from '../types';
import {useState} from 'react';
import api from '../api/api';

type SessionGoalModalProps = {
  session: SessionGetDto;
  client: ClientGetDto;
  goal: GoalGetDto;
  isOpen: boolean;
  onClose: () => void;
};

export const SessionGoalModal: React.FC<SessionGoalModalProps> = ({
  session,
  client,
  goal,
  isOpen,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SessionGoalCreateDto>({
    sessionId: session.id,
    goalId: goal.id,
    correctTrials: 0,
    totalTrials: 0,
    duration: 0,
  });
  console.log(session);

  const handleChange =
    (field: keyof SessionGoalCreateDto) => (value: string | number | Date) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await api.post('/sessions/session-goal', formData);
    } catch (err) {
      setError('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }

    onClose();
  };

  return (
    <>
      <Dialog onOpenChange={onClose} open={isOpen}>
        <DialogPortal>
          <Dialog.Overlay
            animation="quick"
            enterStyle={{opacity: 0}}
            exitStyle={{opacity: 0}}
            opacity={0.8}
            backgroundColor="rgba(0, 0, 0, 0)"
            alignContent="flex-start"
          />
          <Dialog.Content
            elevate
            bordered
            borderRadius={16}
            backgroundColor="white"
            padding={20}
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
                scale: {
                  overshootClamping: true,
                },
              },
            ]}
          >
            <Form onSubmit={handleSubmit} gap={10}>
              <YStack alignItems="center" gap={15}>
                <SizableText size={20} fontWeight="bold" color="black">
                  {client.firstName} {client.lastName}
                </SizableText>
                <SizableText size={16} color="black">
                  {goal.information}
                </SizableText>

                <XStack gap={5}>
                  <YStack gap={10}>
                    <SizableText size={18} color={'black'}>
                      Correct Trials
                    </SizableText>
                    <Input
                      value={formData.correctTrials.toString()}
                      onChangeText={(text) =>
                        handleChange('correctTrials')(text)
                      }
                      placeholder="Correct Trials"
                      size={46}
                      flex={1}
                      gap={20}
                      padding={4}
                      placeholderTextColor="#b0b0b0"
                    />
                  </YStack>
                  <YStack gap={10}>
                    <SizableText size={18} color={'black'}>
                      Total Trials
                    </SizableText>
                    <Input
                      value={formData.totalTrials.toString()}
                      onChangeText={(text) => handleChange('totalTrials')(text)}
                      placeholder="Total Trials"
                      size={46}
                      flex={1}
                      gap={20}
                      padding={4}
                      placeholderTextColor="#b0b0b0"
                    />
                  </YStack>
                  <YStack gap={10}>
                    <SizableText size={18} color={'black'}>
                      Duration
                    </SizableText>
                    <Input
                      value={formData.duration.toString()}
                      onChangeText={(text) => handleChange('duration')(text)}
                      placeholder="Minutes"
                      size={46}
                      flex={1}
                      gap={20}
                      padding={4}
                      placeholderTextColor="#b0b0b0"
                    />
                  </YStack>
                </XStack>
                <XStack
                  gap={10}
                  alignItems="center"
                  justifyContent="space-between"
                  width={'100%'}
                >
                  <YStack>
                    <Button size={40} onPress={onClose}>
                      <Text>Cancel</Text>
                    </Button>
                  </YStack>
                  <YStack>
                    <Button
                      size={40}
                      style={{background: '#282e67'}}
                      onPress={handleSubmit}
                    >
                      <Text color={'white'}>Submit</Text>
                    </Button>
                  </YStack>
                </XStack>
              </YStack>
            </Form>
          </Dialog.Content>
        </DialogPortal>
      </Dialog>
    </>
  );
};
