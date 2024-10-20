import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import based on your project structure

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Call the logout API endpoint
      navigate("/login"); // Redirect to the login page or wherever needed
    } catch (error) {
      console.error("An error occurred during logout:", error);
      // Optionally, handle error (e.g., show a notification)
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
