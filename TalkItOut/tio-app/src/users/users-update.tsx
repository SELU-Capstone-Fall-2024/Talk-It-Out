import type React from 'react';
import {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import api from '../api/api';
import type {UserGetDto, UserUpdateDto} from '../types';
import {Form, Input, SizableText, YStack, Text, Button} from 'tamagui';

const UserUpdate: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserUpdateDto>({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get<UserGetDto>(`/users/${id}`);
        if (response.status === 200) {
          const {firstName, lastName, userName, email} = response.data;
          setUserData({firstName, lastName, userName, email});
        } else {
          setError('Failed to load user.');
        }
      } catch (err) {
        setError('An error occurred while loading the user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (field: keyof UserUpdateDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData: Partial<UserUpdateDto> = {};
      if (userData.firstName) updateData.firstName = userData.firstName;
      if (userData.lastName) updateData.lastName = userData.lastName;
      if (userData.userName) updateData.userName = userData.userName;
      if (userData.email) updateData.email = userData.email;

      const response = await api.put(`/users/${id}`, updateData);
      if (response.status === 200) {
        navigate('/users/listing');
      } else {
        setError('Failed to update user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the user.');
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
          Update User
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color={'#e6f2ff'}>
              First Name
            </SizableText>
            <Input
              value={userData.firstName}
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
              value={userData.lastName}
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
              Email
            </SizableText>
            <Input
              value={userData.email}
              onChangeText={(text) => handleChange('email')(text)}
              placeholder="Email"
              size={46}
              flex={1}
              gap={20}
              padding={4}
              placeholderTextColor="#b0b0b0"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Username
            </SizableText>
            <Input
              value={userData.userName}
              onChangeText={(text) => handleChange('userName')(text)}
              placeholder="UserName"
              size={46}
              flex={1}
              gap={20}
              padding={4}
              placeholderTextColor="#b0b0b0"
            />
          </YStack>

          <Link
            to={`/users/password/${id}`}
            style={{
              marginTop: 15,
              color: '#e6f2ff',
              textDecoration: 'underline',
            }}
          >
            Change Password
          </Link>
          <Button
            gap={10}
            width={150}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            background="#e6f2ff"
            style={{overflow: 'hidden'}}
            theme={loading ? 'secondary' : 'primary'}
            onPress={handleSubmit}
            borderRadius={4}
          >
            <Text fontSize={18}>{loading ? 'Updating...' : 'Update User'}</Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default UserUpdate;
