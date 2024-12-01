import type React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../api/api';
import type {ClientCreateDto} from '../types';
import {Button, Input, SizableText, YStack, Text, Form} from 'tamagui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ClientCreate: React.FC = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientCreateDto>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    userId: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof ClientCreateDto) => (value: string | number | Date) => {
      setClientData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await api.post('/clients', clientData);
      navigate('/clients/listing');
    } catch (err) {
      setError('Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            Create Client
          </SizableText>

          {error && (
            <Text color="red" marginBottom={15}>
              {error}
            </Text>
          )}
          <Form onSubmit={handleSubmit} style={{width: '100%'}}>
            <YStack gap={10}>
              <SizableText size={18} color={'#e6f2ff'}>
                First Name
              </SizableText>
              <Input
                value={clientData.firstName}
                onChangeText={(text) => handleChange('firstName')(text)}
                placeholder="First Name"
                size={46}
                flex={1}
                gap={20}
                padding={4}
                placeholderTextColor="#b0b0b0"
              />
            </YStack>

            <YStack gap={10}>
              <SizableText size={18} color={'#e6f2ff'}>
                Last Name
              </SizableText>
              <Input
                value={clientData.lastName}
                onChangeText={(text) => handleChange('lastName')(text)}
                placeholder="Last Name"
                size={46}
                flex={1}
                gap={20}
                padding={4}
                placeholderTextColor="#b0b0b0"
              />
            </YStack>

            <YStack gap={10}>
              <SizableText size={18} color="#e6f2ff">
                Date of Birth
              </SizableText>
              <DatePicker
                selected={
                  clientData.dateOfBirth
                    ? new Date(clientData.dateOfBirth)
                    : null
                }
                onChange={(date) =>
                  handleChange('dateOfBirth')(date || new Date())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="Date of Birth"
              />
            </YStack>

            <Button
              width={150}
              alignSelf="center"
              size={30}
              padding={12}
              background="#e6f2ff"
              borderRadius={4}
              marginTop={20}
              onPress={handleSubmit}
            >
              <Text fontSize={18}>
                {loading ? 'Creating...' : 'Create Client'}
              </Text>
            </Button>
          </Form>
        </YStack>
      </YStack>
    </>
  );
};

export default ClientCreate;
