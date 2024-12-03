import { Route, Routes } from "react-router-dom";
import Clients from "./clients-listing";
import ClientCreate from "./client-create";
import ClientUpdate from "./client-update";
import ClientView from "./client-view";

export const ClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="create" element={<ClientCreate />} />
      <Route path="listing" element={<Clients />} />
      <Route path=":id/view" element={<ClientView />} />
      <Route path=":id" element={<ClientUpdate />} />
    </Routes>
  );
};
