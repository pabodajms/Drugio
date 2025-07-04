import React, { useEffect, useState } from "react";
import { getPharmacies } from "../../services/pharmacyServices";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PharmacyTable = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    const data = await getPharmacies();
    setPharmacies(data);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPharmacies = pharmacies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pharmacies.length / itemsPerPage);

  const renderPagination = () => {
    const pages = [];

    // Previous button
    pages.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        >
          &lt;
        </button>
      </li>
    );

    // First page
    pages.push(
      <li key={1} className={`page-item ${currentPage === 1 ? "active" : ""}`}>
        <button className="page-link" onClick={() => setCurrentPage(1)}>
          1
        </button>
      </li>
    );

    // Ellipses before current page
    if (currentPage > 3) {
      pages.push(
        <li key="dots-prev" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(
        <li key={currentPage} className="page-item active">
          <button className="page-link">{currentPage}</button>
        </li>
      );
    }

    // Ellipses after current page
    if (currentPage < totalPages - 2) {
      pages.push(
        <li key="dots-next" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Last page
    if (totalPages > 1) {
      pages.push(
        <li
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    pages.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
        >
          &gt;
        </button>
      </li>
    );

    return pages;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">All Pharmacies</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/pharmacy/add")}
        >
          + Add
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover shadow-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {currentPharmacies.map((pharmacy, index) => (
              <tr
                key={index}
                onClick={() =>
                  navigate(`/pharmacy/pharmacydetails/${pharmacy.pharmacy_Id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{pharmacy.pharmacyName}</td>
                <td>{pharmacy.address}</td>
                <td>{pharmacy.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">{renderPagination()}</ul>
      </nav>
    </div>
  );
};

export default PharmacyTable;
