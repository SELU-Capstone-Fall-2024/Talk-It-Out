import { useEffect, useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { View, Text } from "tamagui";
import api from "../api/api"; // Import your API module
import { Response, SessionGetDto } from "../types"; // Import your types
import "./MyCalendar.css"; // Add external CSS here

const MyCalendar = () => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [sessions, setSessions] = useState<SessionGetDto[]>([]); // Initialize as an empty array

  // Fetch sessions when the component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get<Response<SessionGetDto[]>>("/sessions");
        // Set sessions to an empty array if response.data.data is null
        setSessions(response.data.data || []); // Use an empty array as fallback
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (Array.isArray(value)) {
      setDate(value as [Date, Date]); // Value is a range of dates
    } else {
      setDate(value as Date); // Value is a single date
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
        className="custom-calendar" // Applying a custom class for styling
        tileClassName={({ date }) =>
          isDateInSession(date) ? "highlighted-session" : ""
        } // Highlighting session dates
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
