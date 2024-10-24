import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import based on your project structure
import { GoalGetDto, GoalUpdateDto } from "../types"; // Adjust the import based on your types location
import {Input} from "tamagui"

const GoalUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [goalData, setGoalData] = useState<GoalUpdateDto>({
    userId: 0,
    goalInformation: "",
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goal data to populate the form
  useEffect(() => {
    const fetchGoal = async () => {
      setLoading(true);
      try {
        const response = await api.get<GoalGetDto>(`/goals/${id}`); // Adjust the endpoint as necessary
        if (response.status === 200) {
          const { userId, goalInformation, clientId } = response.data;
          setGoalData({ userId, goalInformation, clientId });
        } else {
          setError("Failed to load goal.");
        }
      } catch (err) {
        setError("An error occurred while loading the goal.");
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [id]);

  const handleChange =
    (field: keyof GoalUpdateDto) => (value: string | number) => {
      setGoalData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put(`/goals/${id}`, goalData); // Adjust the endpoint as necessary
      if (response.status === 200) {
        navigate("/goals"); // Redirect to goals listing on success
      } else {
        setError("Failed to update goal. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the goal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Goal</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID</label>
          <Input
            value={goalData.userId}
            onChange={() => handleChange("userId")}
            placeholder="Enter User ID"
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
          <Input
            value={goalData.clientId}
            onChange={() => handleChange("clientId")}
            placeholder="Enter Client ID"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Goal"}
        </button>
      </form>
    </div>
  );
};

export default GoalUpdate;
