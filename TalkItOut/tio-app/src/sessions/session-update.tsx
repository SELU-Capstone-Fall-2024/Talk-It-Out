import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Response, SessionUpdateDto, SessionGetDto } from "../types";

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
          <input
            type="number"
            value={sessionData.userId}
            onChange={(e) => handleChange("userId")(Number(e.target.value))}
            placeholder="Enter User ID"
            required
          />
        </div>

        <div>
          <label>Duration (Minutes)</label>
          <input
            type="number"
            value={sessionData.durationMinutes}
            onChange={(e) =>
              handleChange("durationMinutes")(Number(e.target.value))
            }
            placeholder="Enter duration in minutes"
            required
          />
        </div>

        <div>
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={sessionData.startTime}
            onChange={(e) => handleChange("startTime")(e.target.value)}
            required
          />
        </div>

        <div>
          <label>End Time</label>
          <input
            type="datetime-local"
            value={sessionData.endTime}
            onChange={(e) => handleChange("endTime")(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Group ID</label>
          <input
            type="number"
            value={sessionData.groupId}
            onChange={(e) => handleChange("groupId")(Number(e.target.value))}
            placeholder="Enter Group ID"
            required
          />
        </div>

        <div>
          <label>Client ID</label>
          <input
            type="number"
            value={sessionData.clientId}
            onChange={(e) => handleChange("clientId")(Number(e.target.value))}
            placeholder="Enter Client ID"
            required
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
