import type React from "react";
import { useState } from "react";
import api from "../api/api";
import type { UserCreateDto } from "../types";
import { useNavigate } from "react-router-dom";
import { SizableText, YStack, Text, Input, Button, Form } from "tamagui";
//import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserCreateDto>({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserCreateDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.username ||
      !userData.password
    ) {
      setError("Please fill out all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/users/user", userData);
      if (response.status === 201) {
        navigate("/users/listing");
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the user.");
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
      background="$darkBackground"
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
            <SizableText size={18} color="#e6f2ff">
              First Name
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.firstName}
              onChange={() => handleChange("firstName")}
              placeholder="First Name"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Last Name
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.lastName}
              onChange={() => handleChange("lastName")}
              placeholder="Last Name"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Email
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.email}
              onChange={() => handleChange("email")}
              placeholder="Email"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Username
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.username}
              onChange={() => handleChange("username")}
              placeholder="Enter Username"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Password
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={userData.password}
              onChange={() => handleChange("password")}
              placeholder="Enter password"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
              secureTextEntry
            />
          </YStack>

          <Button
            gap={10}
            width={150}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            background="#e6f2ff"
            style={{ overflow: "hidden" }}
            theme={loading ? "secondary" : "primary"}
            onPress={handleSubmit}
            borderRadius={4}
          >
            <Text fontSize={18}>{loading ? "Creating..." : "Create User"}</Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default UserCreate;
