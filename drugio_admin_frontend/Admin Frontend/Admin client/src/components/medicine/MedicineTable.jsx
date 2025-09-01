import React, { useEffect, useState } from "react";
import { getMedicines } from "../../services/medicineServices";
import { useNavigate } from "react-router-dom";
import AddMedicineForm from "./AddMedicineForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./medicineStyles.css";

const MedicineTable = () => {
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const data = await getMedicines();
    setMedicines(data);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(medicines.length / itemsPerPage);

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

    // Ellipses if needed
    if (currentPage > 3) {
      pages.push(
        <li key="dots-prev" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    // Current page (if not first or last)
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(
        <li key={currentPage} className="page-item active">
          <button className="page-link">{currentPage}</button>
        </li>
      );
    }

    // Ellipses if needed
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">All Medicine</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/medicine/add")}
        >
          + Add
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover shadow-sm">
          <thead>
            <tr>
              <th>Generic Name</th>
              <th>Brand Name</th>
              <th>Manufacturer</th>
              <th>Local Distributor</th>
              <th>Pack Size</th>
              <th>Dosage Form</th>
            </tr>
          </thead>
          <tbody>
            {currentMedicines.map((medicine, index) => (
              <tr
                key={index}
                onClick={() =>
                  navigate(`/medicine/medicinedetails/${medicine.medicine_Id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <td>{medicine.genericName}</td>
                <td>{medicine.brandName}</td>
                <td>{medicine.manufacturerName}</td>
                <td>{medicine.localDistributorName}</td>
                <td>{medicine.packSize}</td>
                <td>{medicine.dosageForm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">{renderPagination()}</ul>
      </nav>

      {showAddForm && (
        <AddMedicineForm
          onClose={() => setShowAddForm(false)}
          onMedicineAdded={fetchMedicines}
        />
      )}
    </div>
  );
};

export default MedicineTable;
