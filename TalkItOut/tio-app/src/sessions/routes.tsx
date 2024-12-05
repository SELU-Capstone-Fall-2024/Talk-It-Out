import { Route, Routes } from "react-router-dom";
import Sessions from "./session-listing";
import SessionCreate from "./session-create";
import SessionUpdate from "./session-update";
import SessionView from "./session-view";

export const SessionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Sessions />} />
      <Route path="create" element={<SessionCreate />} />
      <Route path="/:id/view" element={<SessionView />} />
      <Route path=":id" element={<SessionUpdate />} />
    </Routes>
  );
};
