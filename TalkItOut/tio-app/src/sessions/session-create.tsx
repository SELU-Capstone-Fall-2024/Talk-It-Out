import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { SessionCreateDto, Response } from "../types";
import { H1 } from "tamagui";

const SessionCreate: React.FC = () => {
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState<SessionCreateDto>({
    userId: 0,
    durationMinutes: 0,
    startTime: "",
    endTime: "",
    groupId: 0,
    clientId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange =
    (field: keyof SessionCreateDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "userId" ||
        field === "durationMinutes" ||
        field === "groupId" ||
        field === "clientId"
          ? Number(e.target.value)
          : e.target.value;

      setSessionData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  // Calculate durationMinutes when startTime or endTime changes
  useEffect(() => {
    if (sessionData.startTime && sessionData.endTime) {
      const start = new Date(sessionData.startTime);
      const end = new Date(sessionData.endTime);
      const duration = Math.abs(end.getTime() - start.getTime());
      const minutes = Math.floor(duration / (1000 * 60)); // Convert milliseconds to minutes
      setSessionData((prevData) => ({
        ...prevData,
        durationMinutes: minutes,
      }));
    }
  }, [sessionData.startTime, sessionData.endTime]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<Response<SessionCreateDto>>(
        "/sessions",
        sessionData
      );
      if (response.status === 200 && !response.data.hasErrors) {
        navigate("/sessions"); // Redirect to session listing on success
      } else {
        setError("Failed to create session. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <H1>Create New Session</H1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID</label>
          <input
            type="number"
            id="userId"
            value={sessionData.userId}
            onChange={handleChange("userId")}
            placeholder="Enter User ID"
            required
          />
        </div>

        <div>
          <label htmlFor="startTime">Start Time</label>
          <input
            type="datetime-local"
            id="startTime"
            value={sessionData.startTime}
            onChange={handleChange("startTime")}
            placeholder="Enter start time"
            required
          />
        </div>

        <div>
          <label htmlFor="endTime">End Time</label>
          <input
            type="datetime-local"
            id="endTime"
            value={sessionData.endTime}
            onChange={handleChange("endTime")}
            placeholder="Enter end time"
            required
          />
        </div>

        <div>
          <label htmlFor="durationMinutes">Duration (Minutes)</label>
          <input
            type="number"
            id="durationMinutes"
            value={sessionData.durationMinutes}
            readOnly
          />
        </div>

        <div>
          <label htmlFor="groupId">Group ID</label>
          <input
            type="number"
            id="groupId"
            value={sessionData.groupId}
            onChange={handleChange("groupId")}
            placeholder="Enter Group ID"
          />
        </div>

        <div>
          <label htmlFor="clientId">Client ID</label>
          <input
            type="number"
            id="clientId"
            value={sessionData.clientId}
            onChange={handleChange("clientId")}
            placeholder="Enter Client ID"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default SessionCreate;
