import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { UserLoginDto } from "../types";
import { YStack, Input, Button, Text, SizableText, Form } from "tamagui";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserLoginDto>({
    userName: "",
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

  const handleFormSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!userData.userName || !userData.password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/users/authenticate", userData);
      if (response.status === 200) {
        navigate("/home");
      } else {
        setError("Username or password is incorrect");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
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
      background="$darkBackground"
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding={30}
        borderRadius={15}
        backgroundColor="$darkPrimary"
        shadowColor="rgba(0, 0, 0, 0.5)"
        shadowRadius={10}
        shadowOpacity={0.5}
        shadowOffset={{ width: 0, height: 4 }}
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Login
        </SizableText>
        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={() => handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Username
            </SizableText>
            <Input
              size={46}
              flex={1}
              gap={20}
              padding={4}
              value={userData.userName}
              onChange={handleChange("userName")}
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
              secureTextEntry
              value={userData.password}
              onChange={handleChange("password")}
              placeholder="Enter Password"
              borderColor="#cce6ff"
              background="#3d444d"
              borderRadius={2}
              placeholderTextColor="#e6f2ff"
            />
          </YStack>

          <Button
            width={100}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            background="#e6f2ff"
            style={{ overflow: "hidden", textAlign: "center" }}
            theme={loading ? "secondary" : "primary"}
            onPress={handleFormSubmit}
            borderRadius={4}
          >
            <Text fontSize={18}>{loading ? "Logging in..." : "Login"}</Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default Login;
