import { useEffect, useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import { View, Text, SizableText } from "tamagui";
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

  const getSessionTimeframes = (date: Date) => {
    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.startTime).toDateString();
        return sessionDate === date.toDateString();
      })
      .map((session) => ({
        id: session.id,
        start: new Date(session.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        end: new Date(session.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
  };

  return (
    <View style={{ padding: 16 }}>
      <SizableText size={50} color="black">
        Calendar
      </SizableText>
      <Calendar
        onChange={handleDateChange}
        value={date}
        className="custom-calendar"
        tileContent={({ date }) => {
          const timeframes = getSessionTimeframes(date);
          return (
            <div className="session-timeframes">
              {timeframes.map((timeframe) => (
                <div key={timeframe.id} className="timeframe-box">
                  {timeframe.start} - {timeframe.end}
                </div>
              ))}
            </div>
          );
        }}
      />
    </View>
  );
};

export default MyCalendar;
