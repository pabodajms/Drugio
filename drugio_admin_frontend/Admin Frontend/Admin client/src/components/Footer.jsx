import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="bg-light text-center border-top d-flex align-items-center justify-content-center"
      style={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        height: "40px",
        zIndex: 1000,
      }}
    >
      <p className="mb-0">© 2025 Drugio. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
