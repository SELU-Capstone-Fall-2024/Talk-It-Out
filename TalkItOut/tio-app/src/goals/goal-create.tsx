import React, { useState } from "react";
import api from "../api/api"; // Adjust the import based on your project structure
import { GoalCreateDto } from "../types"; // Adjust the import based on your types location
import { useNavigate } from "react-router-dom";

const GoalCreate: React.FC = () => {
  const navigate = useNavigate();
  const [goalData, setGoalData] = useState<GoalCreateDto>({
    userId: 0,
    goalInformation: "",
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof GoalCreateDto) => (value: string | number) => {
    setGoalData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/goals`, goalData); // Adjust the endpoint as necessary
      if (response.status === 201) {
        navigate("/goals"); // Redirect to goals listing on success
      } else {
        setError("Failed to create goal. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Goal</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID</label>
          <input
            type="number"
            value={goalData.userId}
            onChange={(e) => handleChange("userId")(Number(e.target.value))}
            placeholder="Enter User ID"
            required
          />
        </div>
        <div>
          <label>Goal Information</label>
          <textarea
            value={goalData.goalInformation}
            onChange={(e) => handleChange("goalInformation")(e.target.value)}
            placeholder="Enter goal information"
            required
          />
        </div>
        <div>
          <label>Client ID</label>
          <input
            type="number"
            value={goalData.clientId}
            onChange={(e) => handleChange("clientId")(Number(e.target.value))}
            placeholder="Enter Client ID"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
};

export default GoalCreate;
