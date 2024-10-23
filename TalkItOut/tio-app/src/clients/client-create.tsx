import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import according to your folder structure
import { ClientCreateDto } from "../types"; // Adjust the import according to your folder structure
import type { SizeTokens } from 'tamagui'
import { Button, Input, TextArea, XStack, YStack } from 'tamagui'

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setClientData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
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

  return (
    <div>
      <h1>Create Client</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          value={clientData.firstName}
          onChange={handleChange("firstName")}
          required
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          value={clientData.lastName}
          onChange={handleChange("lastName")}
          required
        />

        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          value={clientData.dateOfBirth}
          onChange={handleChange("dateOfBirth")}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Client"}
        </button>
      </form>
    </div>
  );
};

export default ClientCreate;
