import React from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/medicines": "Medicines",
  "/medicine/add": "Add Medicine",
  "/medicine/medicinedetails/:id": "Medicine Details",
  "/pharmacies": "Pharmacies",
  "/pharmacy/pharmacydetails/:id": "Pharmacies",
  "/pharmacy/add": "Pharmacies",
  "/pharmacy/update/:id": "Pharmacies",
  "/prescriptions": "Prescriptions",
  "/settings": "Settings",
};

const Header = () => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Drugio";

  return (
    <header
      className="d-flex align-items-center bg-primary text-white px-4"
      style={{
        width: "100%",
        position: "fixed",
        top: 0,
        height: "60px",
        zIndex: 1000,
      }}
    >
      <h2 className="m-0">{pageTitle}</h2>
    </header>
  );
};

export default Header;
