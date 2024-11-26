import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "./header.css";
import { FaCog } from "react-icons/fa";
import Logout from "./logout";

const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/" || location.pathname === "/home";

  return (
    <header className="header">
      <div className="header-text">
        <h1 className="title">Talk It Out</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}</span>
            <button className="settings-btn">
              <FaCog className="settings-icon" size={30} color="#282e67" />
            </button>
            <Logout />
          </div>
        )}
      </div>
      {user && (
        <nav className="navbar">
          <Link to="/calendar" className="nav-btn">
            Calendar View
          </Link>
          <Link to="/students" className="nav-btn">
            Student List
          </Link>
          <Link to="/schedule" className="nav-btn">
            Edit Your Schedule
          </Link>
          {!isHome && (
            <Link to="/home" className="nav-btn back-btn">
              Back to Home
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
