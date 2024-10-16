import { Route, Routes } from "react-router-dom";
import Clients from "./clients-listing";
import ClientCreate from "./client-create";
import ClientUpdate from "./client-update";

export const ClientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Clients />} />
      <Route path="create" element={<ClientCreate />} />
      <Route path="update/:id" element={<ClientUpdate />} />
    </Routes>
  );
};
