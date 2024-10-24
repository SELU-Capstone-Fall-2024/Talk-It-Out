import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import according to your folder structure
import { ClientCreateDto } from "../types"; // Adjust the import according to your folder structure
import type { SizeTokens } from 'tamagui'
import { Button, Input, TextArea, XStack, YStack } from 'tamagui'
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import DatePicker from "react-datepicker";

const ClientCreate: React.FC = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientCreateDto>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form changes

  const handleChange =
  (field: keyof ClientCreateDto) =>
  (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setClientData((prevData) => ({
      ...prevData,
      [field]: e.nativeEvent.text,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/clients", clientData); // Adjust the endpoint as necessary
      navigate("/clients"); // Redirect to clients listing after successful creation
    } catch (err) {
      setError("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [startDate, setStartDate] = useState(new Date());

  return (
    <div>
      <h1>Create Client</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <Input
          id="firstName"
          value={clientData.firstName}
          onChange={() => handleChange("firstName")}
        />

        <label htmlFor="lastName">Last Name:</label>
        <Input
          id="lastName"
          value={clientData.lastName}
          onChange={() => handleChange("lastName")}
        />

        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

        <Button  disabled={loading}>
          {loading ? "Creating..." : "Create Client"}
        </Button>
      </form>
    </div>
  );
};

export default ClientCreate;
