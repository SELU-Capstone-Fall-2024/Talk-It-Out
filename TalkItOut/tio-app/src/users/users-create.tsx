import React, { useState } from "react";
import api from "../api/api"; // Adjust the import based on your project structure
import { UserCreateDto } from "../types"; // Adjust the import based on your types location
import { useNavigate } from "react-router-dom";

const UserCreate: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserCreateDto>({
    name: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserCreateDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/users`, userData); // Adjust the endpoint as necessary
      if (response.status === 201) {
        navigate("/users"); // Redirect to goals listing on success
      } else {
        setError("Failed to create user. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="string"
            value={userData.name}
            onChange={(e) => handleChange("name")(e.target.value)}
            placeholder="Enter Name"
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="string"
            value={userData.username}
            onChange={(e) => handleChange("username")(e.target.value)}
            placeholder="Enter Username"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            value={userData.password}
            onChange={(e) => handleChange("password")(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default UserCreate;
