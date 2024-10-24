import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import type { UserGetDto, UserUpdateDto } from "../types";
import { SizableText, YStack } from "tamagui";
import type { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";

const UserUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserUpdateDto>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get<UserGetDto>(`/users/${id}`);
        if (response.status === 200) {
          const { firstName, lastName, username, email } = response.data;
          setUserData({ firstName, lastName, username, email });
        } else {
          setError("Failed to load user.");
        }
      } catch (err) {
        setError("An error occurred while loading the user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange =
    (field: keyof UserUpdateDto) =>
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setUserData((prevData) => ({
        ...prevData,
        [field]: e.nativeEvent.text,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData: Partial<UserUpdateDto> = {};
      if (userData.firstName) updateData.firstName = userData.firstName;
      if (userData.lastName) updateData.lastName = userData.lastName;
      if (userData.username) updateData.username = userData.username;
      if (userData.email) updateData.email = userData.email;

      const response = await api.put(`/users/${id}`, updateData);
      if (response.status === 200) {
        navigate("/users/listing");
      } else {
        setError("Failed to update user. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the user.");
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
          Update User
        </SizableText>
      </YStack>
    </YStack>
  );
};

export default UserUpdate;
