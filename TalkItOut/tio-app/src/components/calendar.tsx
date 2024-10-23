import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { View, Text } from "tamagui";
import api from "../api/api";
import { Response, SessionGetDto } from "../types";
import "./MyCalendar.css";

const MyCalendar = () => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [sessions, setSessions] = useState<SessionGetDto[]>([]); // Initialize as an empty array

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get<Response<SessionGetDto[]>>("/sessions");
        setSessions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value)) {
      setDate(value as [Date, Date]);
    } else {
      setDate(value as Date);
    }
  };

  const isDateInSession = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]; // Get date part only
    return sessions.some((session) => {
      const startDate = new Date(session.startTime).toISOString().split("T")[0];
      const endDate = new Date(session.endTime).toISOString().split("T")[0];
      return dateString >= startDate && dateString <= endDate;
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Select a Date:</Text>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="custom-calendar"
        tileClassName={({ date }) =>
          isDateInSession(date) ? "highlighted-session" : ""
        }
      />
      <View>
        <Text>Sessions:</Text>
        {sessions.map((session) => (
          <Text key={session.id}>
            {`User ID: ${session.userId}, Duration: ${
              session.durationMinutes
            } min, Start: ${new Date(
              session.startTime
            ).toLocaleString()}, End: ${new Date(
              session.endTime
            ).toLocaleString()}`}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default MyCalendar;
