import type React from 'react';
import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import api from '../api/api';
import type {
  Response,
  SessionUpdateDto,
  SessionGetDto,
  GroupGetDto,
  ClientGetDto,
} from '../types';
import {Button, Form, SizableText, YStack, Text} from 'tamagui';
import ReactSelect from 'react-select';
import DatePicker from 'react-datepicker';
import {useAsync} from 'react-use';

const SessionUpdate: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<SessionUpdateDto>({
    userId: 1,
    startTime: '',
    endTime: '',
    groupId: 0,
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const response = await api.get<Response<SessionGetDto>>(
          `/sessions/${id}`
        );
        if (response.data.data && !response.data.hasErrors) {
          const {userId, startTime, endTime, groupId, clientId} =
            response.data.data;
          setSessionData({
            userId,
            startTime,
            endTime,
            groupId,
            clientId,
          });
        } else {
          setError('Failed to load session.');
        }
      } catch (err) {
        setError('An error occurred while loading the session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const {value: clients} = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>('/clients');
    return response.data;
  });
  const clientOptions = clients?.data?.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: client.id.toString(),
  }));

  const {value: groups} = useAsync(async () => {
    const response = await api.get<Response<GroupGetDto[]>>('/groups');
    return response.data;
  });
  const groupOptions = groups?.data?.map((group) => ({
    label: group.groupName,
    value: group.id.toString(),
  }));

  const handleChange =
    (field: keyof SessionUpdateDto) => (value: string | number) => {
      setSessionData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    setLoading(true);
    if (sessionData.clientId && sessionData.groupId) {
      setError('Only select client or group, not both.');
    }

    try {
      const response = await api.put<Response<SessionUpdateDto>>(
        `/sessions/${id}`,
        sessionData
      );
      if (response.status === 200 && !response.data.hasErrors) {
        navigate('/sessions/listing');
      } else {
        setError('Failed to update session. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the session.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading session data...</p>;
  }

  if (error) {
    return <p style={{color: 'red'}}>{error}</p>;
  }

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
          Update Session
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
            <Text fontSize={16}>
              {loading ? 'Updating...' : 'Update Session'}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default SessionUpdate;
