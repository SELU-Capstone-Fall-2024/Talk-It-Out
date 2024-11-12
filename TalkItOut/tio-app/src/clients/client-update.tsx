import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import type { ClientGetDto, ClientCreateDto } from "../types";
import { Input, SizableText, YStack, Text, Button, Form } from "tamagui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ClientUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientCreateDto>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    userId: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await api.get<ClientGetDto>(`/clients/${id}`);
        const { firstName, lastName, dateOfBirth, userId } = response.data;
        setClientData({
          firstName,
          lastName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : "",
          userId,
        });
      } catch (err) {
        setError("Failed to load client data.");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange =
    (field: keyof ClientCreateDto) => (value: string | number | Date) => {
      setClientData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/clients/${id}`, clientData);
      navigate("/clients/listing");
    } catch (err) {
      setError("Failed to update client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            Update Client
          </SizableText>

          {error && (
            <Text color="red" marginBottom={15}>
              {error}
            </Text>
          )}
          <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <YStack gap={10}>
              <SizableText size={18} color={"#e6f2ff"}>
                First Name
              </SizableText>
              <Input
                value={clientData.firstName}
                onChangeText={(text) => handleChange("firstName")(text)}
                size={46}
                flex={1}
                gap={20}
                padding={4}
              />
            </YStack>

            <YStack gap={10}>
              <SizableText size={18} color={"#e6f2ff"}>
                Last Name
              </SizableText>
              <Input
                value={clientData.lastName}
                onChangeText={(text) => handleChange("lastName")(text)}
                size={46}
                flex={1}
                gap={20}
                padding={4}
              />
            </YStack>

            <YStack gap={10}>
              <SizableText size={18} color="#e6f2ff">
                Date of Birth
              </SizableText>
              <DatePicker
                selected={
                  clientData.dateOfBirth
                    ? new Date(clientData.dateOfBirth)
                    : null
                }
                onChange={(date) =>
                  handleChange("dateOfBirth")(date || new Date())
                }
                dateFormat="MM/dd/yyyy"
              />
            </YStack>

            <Button
              width={150}
              alignSelf="center"
              size={30}
              padding={12}
              background="#e6f2ff"
              borderRadius={4}
              marginTop={20}
              onPress={handleSubmit}
            >
              <Text fontSize={18}>
                {loading ? "Updating..." : "Update Client"}
              </Text>
            </Button>
          </Form>
        </YStack>
      </YStack>
    </>
  );
};

export default ClientUpdate;
