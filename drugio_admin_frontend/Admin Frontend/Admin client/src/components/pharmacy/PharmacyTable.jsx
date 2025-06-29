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
              {/* <th>District</th> */}
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
                {/* <td>{pharmacy.district}</td> */}
                <td>{pharmacy.pharmacyName}</td>
                <td>{pharmacy.address}</td>
                <td>{pharmacy.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          {Array.from(
            { length: Math.ceil(pharmacies.length / itemsPerPage) },
            (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            )
          )}
          <li
            className={`page-item ${
              currentPage === Math.ceil(pharmacies.length / itemsPerPage)
                ? "disabled"
                : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PharmacyTable;
