import { Route, Routes } from "react-router-dom";
import Groups from "./group-listing";
import GroupCreate from "./group-create";
import GroupUpdate from "./group-update";

export const GroupRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Groups />} />
      <Route path="create" element={<GroupCreate />} />
      <Route path=":id" element={<GroupUpdate />} />
    </Routes>
  );
};
