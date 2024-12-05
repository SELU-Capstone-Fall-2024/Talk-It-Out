import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import api from "../api/api";
import type {
  Response,
  SessionGetDto,
  ClientGetDto,
  GroupGetDto,
} from "../types";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar-week.css";
import { Button, Text, View, XStack } from "tamagui";
import { useNavigate } from "react-router-dom";

const CalendarWeek = () => {
  const [sessions, setSessions] = useState<SessionGetDto[]>([]);
  const [clientMap, setClientMap] = useState<Record<number, ClientGetDto>>({});
  const localizer = momentLocalizer(moment);
  const navigate = useNavigate();
  const [groupMap, setGroupMap] = useState<Record<number, GroupGetDto>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const [sessionsResponse, clientsResponse, groupsResponse] =
          await Promise.all([
            api.get<Response<SessionGetDto[]>>("/sessions"),
            api.get<Response<ClientGetDto[]>>("/clients"),
            api.get<Response<GroupGetDto[]>>("/groups"),
          ]);

        setSessions(sessionsResponse.data.data || []);
        setClientMap(
          (clientsResponse.data.data || []).reduce((map, client) => {
            map[client.id] = client;
            return map;
          }, {} as Record<number, ClientGetDto>)
        );
        setGroupMap(
          (groupsResponse.data.data || []).reduce((map, group) => {
            map[group.id] = group;
            return map;
          }, {} as Record<number, GroupGetDto>)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const events = sessions.map((session) => {
    const group = session.groupId ? groupMap[session.groupId] : null;
    const client = session.clientId ? clientMap[session.clientId] : null;

    const clientsDisplay = group
      ? group.clientIds
          .map((clientId) => {
            const client = clientMap[clientId];
            return `${client.firstName} ${client.lastName}`;
          })
          .join(", ")
      : `${client?.firstName} ${client?.lastName}`;

    return {
      id: session.id,
      title: "Session",
      clients: clientsDisplay,
      start: new Date(session.startTime),
      end: new Date(session.endTime),
    };
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <View gap={8} style={{ padding: 8 }}>
      <XStack justifyContent="flex-end" gap={15}>
        <Button
          size={30}
          borderRadius={4}
          onPress={() => navigate("/sessions/create")}
          width={175}
          style={{ background: "#282e67" }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Add A Session</Text>
        </Button>
        <Button
          size={30}
          borderRadius={4}
          onPress={() => navigate("/month")}
          width={175}
          style={{ background: "#282e67" }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Monthly View</Text>
        </Button>
      </XStack>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "calc(100vh - 150px)", width: "100%" }}
          defaultView="work_week"
          timeslots={2}
          step={30}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 19, 0, 0)}
          views={["work_week"]}
          onSelectEvent={(event) => navigate(`/sessions/${event.id}/view`)}
        />
      </div>
    </View>
  );
};

export default CalendarWeek;
