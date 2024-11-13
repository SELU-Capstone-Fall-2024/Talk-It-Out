import { useEffect, useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import { View, Text } from "tamagui";
import api from "../api/api";
import type { Response, SessionGetDto } from "../types";
import "./MyCalendar.css";

const MyCalendar = () => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [sessions, setSessions] = useState<SessionGetDto[]>([]);

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
    const dateString = date.toDateString();
    return sessions.some((session) => {
      const startDate = new Date(session.startTime).toDateString();
      const endDate = new Date(session.endTime).toDateString();
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
            {`User ID: ${session.userId}, Start: ${new Date(
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
