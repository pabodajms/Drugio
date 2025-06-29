import React from "react";
import { useLocation } from "react-router-dom";
import "./Header.css"; // Optional CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

const pageTitles = {
  "/admin-dashboard": "Dashboard",
  "/medicines": "Medicines",
  "/pharmacies": "Pharmacies",
  "/pharmacy/pharmacydetails/:id": "Pharmacies",
  "/pharmacy/add": "Pharmacies",
  "/pharmacy/update/:id": "Pharmacies",
  "/manufacturers": "Manufacturers",
  "/local-distributors": "Local Distributors",
  "/settings": "Settings",
};

const Header = () => {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Drugio";

  return (
    <header className="header d-flex align-items-center pl-5">
      <h2 className="m-0">{pageTitle}</h2>
    </header>
  );
};

export default Header;
