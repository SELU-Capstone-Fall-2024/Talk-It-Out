import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Response, SessionUpdateDto, SessionGetDto } from "../types";
import {Input} from "tamagui"

const SessionUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get session ID from the URL
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<SessionUpdateDto>({
    userId: 0,
    durationMinutes: 0,
    startTime: "",
    endTime: "",
    groupId: 0,
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch session data to populate form fields
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const response = await api.get<Response<SessionGetDto>>(
          `/sessions/${id}`
        );
        if (response.data.data && !response.data.hasErrors) {
          const {
            userId,
            durationMinutes,
            startTime,
            endTime,
            groupId,
            clientId,
          } = response.data.data;
          setSessionData({
            userId,
            durationMinutes,
            startTime,
            endTime,
            groupId,
            clientId,
          });
        } else {
          setError("Failed to load session.");
        }
      } catch (err) {
        setError("An error occurred while loading the session.");
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Handle form changes
  const handleChange =
    (field: keyof SessionUpdateDto) => (value: string | number) => {
      setSessionData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put<Response<SessionUpdateDto>>(
        `/sessions/${id}`,
        sessionData
      );
      if (response.status === 200 && !response.data.hasErrors) {
        navigate("/sessions"); // Redirect to sessions listing on success
      } else {
        setError("Failed to update session. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the session.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading session data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Update Session</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID</label>
          <Input
            value={sessionData.userId}
            onChange={() => handleChange("userId")}
            placeholder="Enter User ID"
          />
        </div>

        <div>
          <label>Duration (Minutes)</label>
          <Input
            value={sessionData.durationMinutes}
            onChange={() => handleChange("durationMinutes")}
            placeholder="Enter duration in minutes"
          />
        </div>

        <div>
          <label>Start Time</label>
          <Input
            value={sessionData.startTime}
            onChange={() => handleChange("startTime")}
          />
        </div>

        <div>
          <label>End Time</label>
          <Input
            value={sessionData.endTime}
            onChange={() => handleChange("endTime")}
          />
        </div>

        <div>
          <label>Group ID</label>
          <Input
            value={sessionData.groupId} 
            onChange={() => handleChange("groupId")}
            placeholder="Enter Group ID"
          />
        </div>

        <div>
          <label>Client ID</label>
          <Input
            value={sessionData.clientId}
            onChange={() => handleChange("clientId")}
            placeholder="Enter Client ID"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Session"}
        </button>
      </form>
    </div>
  );
};

export default SessionUpdate;
