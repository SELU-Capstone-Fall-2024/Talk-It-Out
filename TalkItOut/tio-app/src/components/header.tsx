import type React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import { XStack, SizableText } from "tamagui";

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="header">
      <h1 className="title">Talk It Out</h1>
      {user && (
        <div className="user-info">
          <span>Welcome {user.username}</span>
          {/* <Link to="/users/:id">
              ⚙
            </Link> */}
        </div>
      )}
    </header>
  );
};

export default Header;
