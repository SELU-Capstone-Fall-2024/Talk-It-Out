import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import according to your folder structure
import { ClientGetDto, ClientCreateDto } from "../types"; // Adjust the import according to your folder structure

const ClientUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get client ID from the URL
  const navigate = useNavigate();
  const [clientData, setClientData] = useState<ClientCreateDto>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch client data to populate form fields
  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const response = await api.get<ClientGetDto>(`/clients/${id}`); // Adjust the endpoint as necessary
        const { firstName, lastName, dateOfBirth } = response.data;
        setClientData({ firstName, lastName, dateOfBirth });
      } catch (err) {
        setError("Failed to load client data.");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

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
      await api.put(`/clients/${id}`, clientData); // Adjust the endpoint as necessary
      navigate("/clients"); // Redirect to clients listing after successful update
    } catch (err) {
      setError("Failed to update client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading client data...</p>; // Loading state
  }

  return (
    <div>
      <h1>Update Client</h1>
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
          {loading ? "Updating..." : "Update Client"}
        </button>
      </form>
    </div>
  );
};

export default ClientUpdate;
