import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import based on your project structure

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      navigate("/");
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
