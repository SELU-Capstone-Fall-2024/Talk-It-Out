import type React from "react";
import api from "../api/api";
import type { Response, UserGetDto } from "../types";
import { useAsync } from "react-use";
import { Spinner } from "tamagui";

const Users: React.FC = () => {
  const { loading, value: users } = useAsync(async () => {
    const response = await api.get<Response<UserGetDto[]>>("/users");
    return response.data;
  });
  console.log(users);

  return (
    <div>
      <h1>Users</h1>
      {loading && <Spinner />}
      {users?.hasErrors && <div>Error loading users.</div>}
      {users && !loading && users.data?.length === 0 && (
        <div>No users found.</div>
      )}
      {!loading && users && (
        <ul>
          {users.data?.map((user) => {
            console.log(user.userName);
            return (
              <li key={user.id}>
                <h3>{user.userName}:</h3>
                <div>
                  Name: {user.firstName} {user.lastName}
                </div>
                <div>Email: {user.email}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default Users;
