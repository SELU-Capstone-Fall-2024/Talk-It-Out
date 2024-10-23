import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import based on your project structure
import { UserLoginDto } from "../types"; // Adjust the import based on your types location
import {
  YStack,
  Input,
  Button,
  Text,
  SizableText,
  Form,
  SizeTokens,
} from "tamagui";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
//import config from "../../tamagui.config";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserLoginDto>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof UserLoginDto) =>
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setUserData((prevData) => ({
        ...prevData,
        [field]: e.nativeEvent.text,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors
    if (!userData.username || !userData.password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }
    try {
      const response = await api.post("/authenticate", userData); // Adjust the endpoint as necessary
      if (response.status === 200) {
        // Successful authentication
        navigate("/users"); // Redirect to the users page or wherever needed
      } else {
        setError("Username or password is incorrect");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$4"
      background="$background"
    >
      <SizableText size="$8" marginBottom="$4">
        Login
      </SizableText>
      {error && (
        <Text color="red" marginBottom="$2">
          {error}
        </Text>
      )}

      <Form onSubmit={() => handleSubmit} gap="$4" width="80%" maxWidth={400}>
        <YStack gap="$2">
          <SizableText size="$6">Username</SizableText>
          <Input
            size="$4"
            value={userData.username}
            onChange={handleChange("username")} // Fix onChangeText to onChange
            placeholder="Enter Username"
          />
        </YStack>

        <YStack space="$2">
          <SizableText size="$6">Password</SizableText>
          <Input
            size="$4"
            secureTextEntry
            value={userData.password}
            onChange={handleChange("password")} // Fix onChangeText to onChange
            placeholder="Enter Password"
          />
        </YStack>

        <Button
          size="$4"
          disabled={loading}
          theme={loading ? "red" : "blue"}
          onPress={() => handleSubmit}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </YStack>
  );
};

export default Login;
