import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import type { ClientGetDto, Response, OptionType } from '../types';
import {
  YStack,
  SizableText,
  Button,
  Input,
  Text,
  Form,
  XStack,
  Spinner,
} from 'tamagui';
import DatePicker from 'react-datepicker';
import ReactSelect from 'react-select';
import { useAsync } from 'react-use';
import Option from '../components/multi-select';

const SessionCreate: React.FC = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    userId: 1,
    startTime: '',
    endTime: '',
    groupId: 0,
    clientId: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionSelected, setOptionSelected] = useState<OptionType[] | null>(
    null
  );

  const { value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>('/clients');
    return response.data;
  });

  const clientOptions = clients?.data?.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: `${client.id.toString()}`,
  }));

  const handleOptionSelected = (selected: OptionType[] | null) => {
    setOptionSelected(selected);
  };

  const handleChange = (
    field: keyof typeof sessionData,
    value: string | number
  ) => {
    setSessionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!sessionData.startTime || !sessionData.endTime) {
      setError('Please select both start and end times.');
      return;
    }

    setLoading(true);
    try {
      if (optionSelected && optionSelected.length === 1) {
        const clientId = Number(optionSelected[0].value);
        await api.post('/sessions', { ...sessionData, clientId });
      } else if (optionSelected && optionSelected.length > 1) {
        const groupResponse = await api.post('/groups', {
          userId: sessionData.userId,
          groupName: `Group created on ${new Date().toLocaleString()}`,
          clientIds: optionSelected.map((client) => Number(client.value)),
        });

        if (groupResponse.status === 201) {
          const groupId = groupResponse.data.id;
          await api.post('/sessions', { ...sessionData, groupId });
        } else {
          throw new Error('Failed to create group.');
        }
      }
      navigate('/week');
    } catch (err) {
      console.error(err);
      setError('An error occurred while creating the session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="flex-start"
      alignItems="center"
      padding={20}
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={500}
        padding={30}
        borderRadius={15}
        alignItems="center"
      >
        <XStack alignItems="center" justifyContent="space-between" width="100%">
          <SizableText size={30} marginBottom={20} color="black">
            Create a New Session
          </SizableText>

          <Button
            size={25}
            style={{background: '#282e67'}}
            borderRadius={4}
            onPress={() => navigate("/week")}
          >
            <Text color={'white'}>Back</Text>
          </Button>
        </XStack>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="black">
              Start Time
            </SizableText>
            <DatePicker
              selected={
                sessionData.startTime ? new Date(sessionData.startTime) : null
              }
              onChange={(date) =>
                handleChange('startTime', date?.toISOString() || '')
              }
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select Start Time"
              className="custom-date-picker" // Add a custom class for consistent styling
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              End Time
            </SizableText>
            <DatePicker
              selected={
                sessionData.endTime ? new Date(sessionData.endTime) : null
              }
              onChange={(date) =>
                handleChange('endTime', date?.toISOString() || '')
              }
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Select End Time"
              className="custom-date-picker"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Add Clients
            </SizableText>
            <ReactSelect
              options={clientOptions}
              isMulti={true}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option }}
              onChange={(selected) =>
                handleOptionSelected(selected as OptionType[] | null)
              }
              value={optionSelected}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: '#ccc',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#e6f2ff',
                  color: '#000',
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 5,
                }),
              }}
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Notes
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={sessionData.notes}
              onChangeText={(text) => handleChange('notes', text)}
              placeholder="Notes"
              placeholderTextColor="gray"
              color="black"
              borderRadius={2}
            />
          </YStack>

          <Button
            width={150}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            style={{ overflow: 'hidden', background: '#282e67' }}
            onPress={handleSubmit}
            borderRadius={4}
            marginTop={20}
          >
            <Text fontSize={18} color={"white"}>
              {loading ? <Spinner/> : 'Create Session'}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default SessionCreate;
