import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserCreateDto } from "../types";
import {
  YStack,
  Input,
  Button,
  Text,
  SizableText,
  Form,
  Spinner,
} from "tamagui";
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import api from "../api/api";

const SignUp: React.FC = () => {
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

  const handleChange =
    (field: keyof UserCreateDto) =>
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setUserData((prevData) => ({
        ...prevData,
        [field]: e.nativeEvent.text,
      }));
    };

  const handleFormSubmit = async () => {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.userName ||
      !userData.password
    ) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/users", userData);

      if (response.status === 201) {
        navigate("/home");
      } else {
        setError('Failed to create user. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the user.');
    } finally {
      setLoading(false);
    }
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
        shadowOffset={{ width: 0, height: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#282E67">
          Sign Up
        </SizableText>
        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={() => handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="black">
              First Name
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.firstName}
              onChange={handleChange("firstName")}
              placeholder="Enter First Name"
              borderColor="gray"
              borderRadius={2}
              placeholderTextColor="gray"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Last Name
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.lastName}
              onChange={handleChange("lastName")}
              placeholder="Enter Last Name"
              borderColor="gray"
              borderRadius={2}
              placeholderTextColor="gray"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Email
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.email}
              onChange={handleChange("email")}
              placeholder="Enter Email"
              borderColor="gray"
              borderRadius={2}
              placeholderTextColor="gray"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="black">
              Username
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.userName}
              onChange={handleChange("userName")}
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
              onChange={handleChange("password")}
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
            theme={loading ? "secondary" : "primary"}
            onPress={handleFormSubmit}
            borderRadius={4}
          >
            <Text fontSize={18} color="white">
              {loading ? <Spinner /> : "Sign Up"}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default SignUp;
