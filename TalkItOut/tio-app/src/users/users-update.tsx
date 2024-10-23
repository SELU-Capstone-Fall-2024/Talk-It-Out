import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import { UserGetDto, UserUpdateDto } from "../types";

const UserUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserUpdateDto>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
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
          const { firstName, lastName, username, email } = response.data;
          setUserData({ firstName, lastName, username, email });
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
      if (userData.firstName) updateData.firstName = userData.firstName;
      if (userData.lastName) updateData.lastName = userData.lastName;
      if (userData.username) updateData.username = userData.username;
      if (userData.email) updateData.email = userData.email;

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
