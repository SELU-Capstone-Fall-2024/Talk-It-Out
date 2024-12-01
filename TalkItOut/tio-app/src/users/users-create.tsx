import type React from 'react';
import {useState} from 'react';
import api from '../api/api';
import type {UserCreateDto} from '../types';
import {useNavigate} from 'react-router-dom';
import {SizableText, YStack, Text, Input, Button, Form, View} from 'tamagui';
import {FiEye, FiEyeOff} from 'react-icons/fi';
import {TouchableOpacity} from 'react-native';

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserCreateDto>({
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserCreateDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async () => {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.userName ||
      !userData.password
    ) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users', userData);
      if (response.status === 201) {
        navigate('/users/listing');
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the user.');
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
        backgroundColor="$darkBackground"
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Create User
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

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Password
            </SizableText>
            <View>
              <Input
                value={userData.password}
                onChangeText={(text) => handleChange('password')(text)}
                placeholder="Password"
                size={46}
                flex={1}
                gap={20}
                padding={4}
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {isPasswordVisible ? (
                  <FiEyeOff color="#e6f2ff" size={20} />
                ) : (
                  <FiEye color="#e6f2ff" size={20} />
                )}
                <Text color="#e6f2ff" style={{marginLeft: 5}}>
                  {isPasswordVisible ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </YStack>

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
            <Text fontSize={18}>{loading ? 'Creating...' : 'Create User'}</Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default UserCreate;
