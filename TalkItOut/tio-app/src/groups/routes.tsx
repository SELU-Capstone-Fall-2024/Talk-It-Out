import { Route, Routes } from "react-router-dom";
import Groups from "./group-listing";

export const GroupRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Groups />} />
    </Routes>
  );
};
