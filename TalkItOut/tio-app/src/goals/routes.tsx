import { Route, Routes } from "react-router-dom";
import Goals from "./goal-listing";
import GoalCreate from "./goal-create";
import GoalUpdate from "./goal-update";

export const GoalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Goals />} />
      <Route path="create/:id" element={<GoalCreate />} />
      <Route path=":id" element={<GoalUpdate />} />
    </Routes>
  );
};
