import type React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Form, Input, SizableText, YStack, Text, Button, View } from "tamagui";
import { TouchableOpacity } from "react-native";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCurrentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`users/password/${id}`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        navigate("/users/listing");
      } else {
        setError("Failed to update password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the password.");
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
        backgroundColor="$darkPrimary"
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Update Password
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Current Password
            </SizableText>
            <View>
              <Input
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
                placeholder="Enter Current Password"
                size={46}
                flex={1}
                gap={20}
                padding={4}
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!isCurrentPasswordVisible}
              />
              <TouchableOpacity
                onPress={toggleCurrentPasswordVisibility}
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {isCurrentPasswordVisible ? (
                  <FiEyeOff color="#e6f2ff" size={20} />
                ) : (
                  <FiEye color="#e6f2ff" size={20} />
                )}
                <Text color="#e6f2ff" style={{ marginLeft: 5 }}>
                  {isCurrentPasswordVisible ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              New Password
            </SizableText>
            <View>
              <Input
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                placeholder="Enter New Password"
                size={46}
                flex={1}
                gap={20}
                padding={4}
                placeholderTextColor="#b0b0b0"
                secureTextEntry={!isNewPasswordVisible}
              />
              <TouchableOpacity
                onPress={toggleNewPasswordVisibility}
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {isNewPasswordVisible ? (
                  <FiEyeOff color="#e6f2ff" size={20} />
                ) : (
                  <FiEye color="#e6f2ff" size={20} />
                )}
                <Text color="#e6f2ff" style={{ marginLeft: 5 }}>
                  {isNewPasswordVisible ? "Hide" : "Show"}
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
            style={{ overflow: "hidden" }}
            theme={loading ? "secondary" : "primary"}
            onPress={handleSubmit}
            borderRadius={4}
          >
            <Text fontSize={14}>
              {loading ? "Updating..." : "Update Password"}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default PasswordUpdate;
