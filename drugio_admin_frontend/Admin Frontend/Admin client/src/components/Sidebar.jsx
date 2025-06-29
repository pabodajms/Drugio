import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPills,
  FaStore,
  FaCog,
  FaBars,
  FaIndustry,
  FaTruck,
} from "react-icons/fa";
import "./Sidebar.css"; // Import styles

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo">
        <span className="logo-text">Drugio</span>
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaBars />
        </button>
      </div>

      <nav className="nav-links">
        <NavLink to="/admin-dashboard" className="nav-item">
          <FaHome className="icon" />
          <span className="link-text">Dashboard</span>
        </NavLink>

        <NavLink to="/medicines" className="nav-item">
          <FaPills className="icon" />
          <span className="link-text">Medicine</span>
        </NavLink>

        <NavLink to="/pharmacies" className="nav-item">
          <FaStore className="icon" />
          <span className="link-text">Pharmacies</span>
        </NavLink>

        {/* <NavLink to="/manufacturers" className="nav-item">
          <FaIndustry className="icon" />
          <span className="link-text">Manufacturers</span>
        </NavLink>

        <NavLink to="/local-distributors" className="nav-item">
          <FaTruck className="icon" />
          <span className="link-text">Local Distributors</span>
        </NavLink> */}

        <NavLink to="/settings" className="nav-item">
          <FaCog className="icon" />
          <span className="link-text">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
