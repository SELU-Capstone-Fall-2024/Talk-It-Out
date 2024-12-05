import type React from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import type {UserLoginDto} from '../types';
import {YStack, Input, Button, Text, SizableText, Form, Spinner} from 'tamagui';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useAuth } from "../auth/auth-context";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserLoginDto>({
    userName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {login} = useAuth();

  const handleChange =
    (field: keyof UserLoginDto) =>
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setUserData((prevData) => ({
        ...prevData,
        [field]: e.nativeEvent.text,
      }));
    };

  const handleFormSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!userData.userName || !userData.password) {
      setError('Username and password are required.');
      setLoading(false);
      return;
    }

    const response = await login(userData);

    if (response.errors.length > 0) {
      setLoading(false);
      setError(response.errors[0].message);
      return;
    }
    navigate('/home');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFormSubmit();
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      background="white"
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding={30}
        borderRadius={15}
        backgroundColor="white"
        shadowColor="rgba(0, 0, 0, 0.5)"
        shadowRadius={10}
        shadowOffset={{width: 0, height: 4}}
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#282E67">
          Sign In
        </SizableText>
        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={() => handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="black">
              Username
            </SizableText>
            <Input
              size={46}
              flex={1}
              gap={20}
              padding={4}
              value={userData.userName}
              onChange={handleChange('userName')}
              placeholder="Enter Username"
              borderColor="gray"
              borderRadius={2}
              placeholderTextColor="gray"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Password
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              secureTextEntry
              value={userData.password}
              onChange={handleChange('password')}
              placeholder="Enter Password"
              borderColor="gray"
              borderRadius={2}
              placeholderTextColor="gray"
            />
          </YStack>

          <Button
            width={100}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            background="#282E67"
            style={{overflow: 'hidden', textAlign: 'center'}}
            theme={loading ? 'secondary' : 'primary'}
            onPress={handleFormSubmit}
            borderRadius={4}
          >
            <Text fontSize={18} color="white">
              {loading ? <Spinner /> : 'Sign In'}
            </Text>
          </Button>
        </Form>
        {/* <Text marginTop={10} fontSize={14}>Need to Create a New Account? <Link to="/users/create" style={{color: "#282E67" }}>Sign Up Here.</Link></Text> */}
      </YStack>
    </YStack>
  );
};

export default Login;
