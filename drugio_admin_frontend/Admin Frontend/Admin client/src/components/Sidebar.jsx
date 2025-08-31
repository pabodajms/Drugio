import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaPills, FaStore, FaCog, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`d-flex flex-column bg-white shadow`}
      style={{
        width: isCollapsed ? "80px" : "250px",
        transition: "width 0.3s ease-in-out",
        minHeight: "100vh",
      }}
    >
      {/* Logo Section */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <span
          className="fw-bold text-primary"
          style={{ display: isCollapsed ? "none" : "block" }}
        >
          Drugio
        </span>
        <button
          className="btn btn-link text-primary p-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column pt-2">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 nav-link ${
              isActive ? "bg-primary text-white rounded" : "text-secondary"
            }`
          }
        >
          <FaHome className="me-2" size={18} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/medicines"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 nav-link ${
              isActive ? "bg-primary text-white rounded" : "text-secondary"
            }`
          }
        >
          <FaPills className="me-2" size={18} />
          {!isCollapsed && <span>Medicine</span>}
        </NavLink>

        <NavLink
          to="/pharmacies"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 nav-link ${
              isActive ? "bg-primary text-white rounded" : "text-secondary"
            }`
          }
        >
          <FaStore className="me-2" size={18} />
          {!isCollapsed && <span>Pharmacies</span>}
        </NavLink>

        <NavLink
          to="/prescriptions"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 nav-link ${
              isActive ? "bg-primary text-white rounded" : "text-secondary"
            }`
          }
        >
          <FaStore className="me-2" size={18} />
          {!isCollapsed && <span>Prescriptions</span>}
        </NavLink>

        {/* <NavLink
          to="/settings"
          className={({ isActive }) =>
            `d-flex align-items-center px-3 py-2 nav-link ${
              isActive ? "bg-primary text-white rounded" : "text-secondary"
            }`
          }
        >
          <FaCog className="me-2" size={18} />
          {!isCollapsed && <span>Settings</span>}
        </NavLink> */}
      </nav>
    </div>
  );
};

export default Sidebar;
