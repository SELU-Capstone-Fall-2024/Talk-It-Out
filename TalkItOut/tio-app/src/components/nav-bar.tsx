import React, { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Logout from "./logout";

const Navbar: React.FC = () => {
  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link to="/home" style={styles.navLink}>
            Home
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/clients/listing" style={styles.navLink}>
            Clients
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/goals/listing" style={styles.navLink}>
            Goals
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/groups/listing" style={styles.navLink}>
            Groups
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/sessions/listing" style={styles.navLink}>
            Sessions
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/users/listing" style={styles.navLink}>
            Users
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/calendar" style={styles.navLink}>
            Calendar
          </Link>
        </li>
        <li style={styles.navItem}>
          <Logout />
        </li>
      </ul>
    </nav>
  );
};

const styles: { [key: string]: CSSProperties } = {
  nav: {
    background: "#282c34",
    padding: "1rem",
    position: "fixed", // Make the navbar fixed at the top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensure it stays above other content
  },
  navList: {
    listStyleType: "none",
    display: "flex",
    justifyContent: "space-around",
    padding: 0,
    margin: 0,
  },
  navItem: {
    margin: "0 15px",
  },
  navLink: {
    color: "#61dafb",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
