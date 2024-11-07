import { Route, Routes } from "react-router-dom";
import Users from "./user-listing";
import UserCreate from "./users-create";
import UserUpdate from "./users-update";
import PasswordUpdate from "./password-update";

export const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index path="listing" element={<Users />} />
      <Route path="create" element={<UserCreate />} />
      <Route path=":id" element={<UserUpdate />} />
      <Route path="password/:id" element={<PasswordUpdate />} />
    </Routes>
  );
};
