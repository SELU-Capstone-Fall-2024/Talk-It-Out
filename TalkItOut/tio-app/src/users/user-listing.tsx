import type React from "react";
import api from "../api/api";
import type { Response, UserGetDto } from "../types";
import { useAsync } from "react-use";
import { Button, YStack, SizableText, Spinner, Text, XStack } from "tamagui";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const { loading, value: users } = useAsync(async () => {
    const response = await api.get<Response<UserGetDto[]>>("/users");
    return response.data;
  });
  const navigate = useNavigate();

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  return (
    <YStack>
      <SizableText size={50} color="#e6f2ff">
        Users
      </SizableText>
      <Button
        size={30}
        background="#e6f2ff"
        borderRadius={4}
        onPress={() => navigate("/users/create")}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>Create A User</Text>
      </Button>
      {loading && <Spinner color="#e6f2ff" size="large" />}
      {users?.hasErrors && (
        <SizableText size={25} color="#e6f2ff">
          Error loading users.
        </SizableText>
      )}
      {users && !loading && users.data?.length === 0 && (
        <SizableText size={25} color="#e6f2ff">
          No users found.
        </SizableText>
      )}
      {!loading && users && (
        <YStack
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            width: "100%",
            padding: 0,
            margin: 0,
          }}
          gap={15}
          alignItems="center"
        >
          {users.data?.map((user) => (
            <YStack
              key={user.id}
              padding={15}
              borderWidth={1}
              borderColor="black"
              backgroundColor="white"
              width="100%"
              gap={10}
            >
              <Text style={{ color: "black" }}>Username: {user.userName}</Text>
              <Text style={{ color: "black" }}>
                Name: {user.firstName} {user.lastName}
              </Text>
              <Text style={{ color: "black" }}>Email: {user.email}</Text>
              <XStack gap={10}>
                <Button
                  size={25}
                  background="#e6f2ff"
                  borderRadius={4}
                  onPress={() => navigate(`/users/${user.id}`)}
                >
                  <Text style={{ color: "#000", fontSize: 16 }}>
                    Update User
                  </Text>
                </Button>
                <Button
                  size={25}
                  background="#b32d00"
                  borderRadius={4}
                  onPress={() => user.id && handleDeleteUser(user.id)}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>
                    Delete User
                  </Text>
                </Button>
              </XStack>
            </YStack>
          ))}
        </YStack>
      )}
    </YStack>
  );
};

export default Users;
