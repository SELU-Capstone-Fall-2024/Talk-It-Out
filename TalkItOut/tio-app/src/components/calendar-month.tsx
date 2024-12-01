import { useEffect, useState } from "react";
import Calendar, { type CalendarProps } from "react-calendar";
import { View, Text, XStack, Button } from "tamagui";
import api from "../api/api";
import type { Response, SessionGetDto } from "../types";
import "./calendar-month.css";
import { useNavigate } from "react-router-dom";

const CalendarMonth = () => {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [sessions, setSessions] = useState<SessionGetDto[]>([]);
  const navigate = useNavigate();

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
    <View style={{ padding: 8 }}>
      <XStack justifyContent="flex-end" gap={15}>
        <Button
          size={30}
          background="#282e67"
          borderRadius={4}
          onPress={() => navigate("/sessions/create")}
          width={175}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Add A Session</Text>
        </Button>
        <Button
          size={30}
          background="#282e67"
          borderRadius={4}
          onPress={() => navigate("/week")}
          width={175}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Weekly View</Text>
        </Button>
      </XStack>
      <View style={{ padding: 8 }}>
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
    </View>
  );
};

export default CalendarMonth;
