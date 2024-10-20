import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Adjust the import based on your project structure
import { UserLoginDto } from "../types"; // Adjust the import based on your types location

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserLoginDto>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof UserLoginDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await api.post("/authenticate", userData); // Adjust the endpoint as necessary
      if (response.status === 200) {
        // Successful authentication
        navigate("/users"); // Redirect to the users page or wherever needed
      } else {
        setError("Username or password is incorrect");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={userData.username}
            onChange={(e) => handleChange("username")(e.target.value)}
            placeholder="Enter Username"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) => handleChange("password")(e.target.value)}
            placeholder="Enter Password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
