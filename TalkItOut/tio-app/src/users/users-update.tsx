import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { UserGetDto, UserUpdateDto } from "../types";

const UserUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserUpdateDto>({
    name: "",
    username: "",
    password: "", // Password will not be updated here
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data to populate the form
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get<UserGetDto>(`/users/${id}`);
        if (response.status === 200) {
          const { name, username } = response.data;
          setUserData({ name, username, password: "" });
        } else {
          setError("Failed to load user.");
        }
      } catch (err) {
        setError("An error occurred while loading the user.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (field: keyof UserUpdateDto) => (value: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare update object, only include fields that are not empty
      const updateData: Partial<UserUpdateDto> = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.username) updateData.username = userData.username;

      const response = await api.put(`/users/${id}`, updateData);
      if (response.status === 200) {
        navigate("/users");
      } else {
        setError("Failed to update user. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while updating the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update User</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="string"
            value={userData.name}
            onChange={(e) => handleChange("name")(e.target.value)}
            placeholder="Enter Name"
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="string"
            value={userData.username}
            onChange={(e) => handleChange("username")(e.target.value)}
            placeholder="Enter Username"
          />
        </div>

        <div>
          <Link to={`/users/${id}/password-update`}>Change Password</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
