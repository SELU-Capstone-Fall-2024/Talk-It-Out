import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { ClientCreateDto } from "../types";
import { Button, Input, SizableText, YStack, Text, Form } from "tamagui";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import DatePicker from "react-datepicker";

const ClientCreate: React.FC = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientCreateDto>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    userId: 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange =
    (field: keyof ClientCreateDto) =>
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setClientData((prevData) => ({
        ...prevData,
        [field]: e.nativeEvent.text,
      }));
    };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await api.post("/clients", clientData);
      navigate("/clients/listing");
    } catch (err) {
      setError("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [startDate, setStartDate] = useState<Date | null>(null);

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
          shadowColor="rgba(0, 0, 0, 0.5)"
          shadowRadius={10}
          shadowOpacity={0.5}
          shadowOffset={{ width: 0, height: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          <SizableText size={30} marginBottom={20} color="#e6f2ff">
            Create Client
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
                size={46}
                flex={1}
                gap={20}
                padding={4}
                value={clientData.firstName}
                onChange={handleChange("firstName")}
                placeholder="First Name"
                borderColor="#cce6ff"
                background="#3d444d"
                borderRadius={2}
                placeholderTextColor="#e6f2ff"
              />
            </YStack>

            <YStack gap={10}>
              <SizableText size={18} color={"#e6f2ff"}>
                Last Name
              </SizableText>
              <Input
                size={46}
                flex={1}
                gap={20}
                padding={4}
                value={clientData.lastName}
                onChange={handleChange("lastName")}
                placeholder="Last Name"
                borderColor="#cce6ff"
                background="#3d444d"
                borderRadius={2}
                placeholderTextColor="#e6f2ff"
              />
            </YStack>
            <YStack gap={10}>
              <SizableText size={18} color="#e6f2ff">
                Date of Birth
              </SizableText>
              <DatePicker
                openToDate={new Date("1993/09/28")}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MM/dd/yyyy"
                className="datepicker"
                placeholderText="Select Date"
              />
            </YStack>

            <Button
              width={150}
              alignSelf="center"
              size={30}
              padding={12}
              disabled={loading}
              background="#e6f2ff"
              borderRadius={4}
              marginTop={20}
              onPress={handleSubmit}
              style={{ overflow: "hidden" }}
              theme={loading ? "secondary" : "primary"}
            >
              <Text fontSize={18}>
                {loading ? "Creating..." : "Create Client"}
              </Text>
            </Button>
          </Form>
        </YStack>
      </YStack>
    </>
  );
};

export default ClientCreate;
