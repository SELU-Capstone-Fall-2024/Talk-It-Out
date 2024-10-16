import React from "react";
import api from "../api/api";
import { Response, GoalGetDto } from "../types";
import { useAsync } from "react-use";
import { Spinner } from "tamagui";

const Goals: React.FC = () => {
  const { loading, value: goals } = useAsync(async () => {
    const response = await api.get<Response<GoalGetDto[]>>("/goals");
    return response.data;
  });

  return (
    <div>
      <h1>Goals</h1>
      {loading && <Spinner />}
      {goals?.hasErrors && <div>Error loading goals.</div>}
      {goals && !loading && goals.data?.length === 0 && (
        <div>No goals found.</div>
      )}
      {!loading && goals && (
        <ul>
          {goals.data?.map((goal) => (
            <li key={goal.id}>
              {goal.userId}
              {goal.clientId}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Goals;
