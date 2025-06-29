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
  const navigate = useNavigate(); // Use navigate hook

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const data = await getMedicines();
    setMedicines(data);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicines = medicines.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4">
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
                <td>{medicine.distributorName}</td>
                <td>{medicine.packSize}</td>
                <td>{medicine.dosageForm}</td>
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
            { length: Math.ceil(medicines.length / itemsPerPage) },
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
              currentPage === Math.ceil(medicines.length / itemsPerPage)
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
