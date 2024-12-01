import type React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/api';
import type {ClientGetDto, GroupGetDto, Response} from '../types';
import {YStack, SizableText, Button, Text, Form} from 'tamagui';
import ReactSelect from 'react-select';
import {useAsync} from 'react-use';
import DatePicker from 'react-datepicker';

const SessionCreate: React.FC = () => {
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState({
    userId: 1,
    startTime: '',
    endTime: '',
    groupId: 0,
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {value: clients} = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>('/clients');
    return response.data;
  });

  const {value: groups} = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>('/groups');
    return response.data;
  });

  const clientOptions = clients?.data?.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: client.id.toString(),
  }));

  const groupOptions = groups?.data?.map((group) => ({
    label: group.groupName,
    value: group.id.toString(),
  }));

  const handleChange =
    (field: keyof typeof sessionData) => (value: string | number) => {
      setSessionData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    if (!sessionData.startTime || !sessionData.endTime) {
      setError('Please select both start and end times.');
      return;
    }

    if (sessionData.clientId && sessionData.groupId) {
      setError('Only select client or group, not both.');
    }

    setLoading(true);
    try {
      const response = await api.post<Response<typeof sessionData>>(
        '/sessions',
        sessionData
      );
      if (response.status === 201 && !response.data.hasErrors) {
        navigate('/sessions/listing');
      } else {
        setError('Failed to create session. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the session.');
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
          Create New Session
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Start Time
            </SizableText>
            <DatePicker
              selected={
                sessionData.startTime ? new Date(sessionData.startTime) : null
              }
              onChange={(date) =>
                handleChange('startTime')(date?.toISOString() || '')
              }
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select Start Time"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              End Time
            </SizableText>
            <DatePicker
              selected={
                sessionData.endTime ? new Date(sessionData.endTime) : null
              }
              onChange={(date) =>
                handleChange('endTime')(date?.toISOString() || '')
              }
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select End Time"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Select Client
            </SizableText>
            <ReactSelect
              options={clientOptions}
              onChange={(selectedOption) =>
                handleChange('clientId')(Number(selectedOption?.value))
              }
              value={clientOptions?.find(
                (option) => Number(option.value) === sessionData.clientId
              )}
              placeholder="Select Client"
              isClearable={true}
            />
          </YStack>
          <SizableText size={18} color="#e6f2ff">
            Or
          </SizableText>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Select Group
            </SizableText>
            <ReactSelect
              options={groupOptions}
              onChange={(selectedOption) =>
                handleChange('groupId')(Number(selectedOption?.value))
              }
              value={groupOptions?.find(
                (option) => Number(option.value) === sessionData.groupId
              )}
              placeholder="Select Group"
              isClearable={true}
            />
          </YStack>

          <Button
            width={150}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            onPress={handleSubmit}
            borderRadius={4}
            marginTop={20}
          >
            <Text fontSize={18}>
              {loading ? 'Creating...' : 'Create Session'}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default SessionCreate;
