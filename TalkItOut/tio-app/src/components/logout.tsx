import type React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
