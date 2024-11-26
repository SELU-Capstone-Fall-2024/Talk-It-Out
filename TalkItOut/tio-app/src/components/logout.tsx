import type React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "./logout.css";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-btn">
        Sign Out
      </button>
    </div>
  );
};

export default Logout;
