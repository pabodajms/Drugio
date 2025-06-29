import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteMedicine, getMedicines } from "../../services/medicineServices"; // Import your medicine fetching function
import "bootstrap/dist/css/bootstrap.min.css";

const MedicineDetails = () => {
  const { id } = useParams(); // Get medicine ID from URL
  const [medicine, setMedicine] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      const allMedicines = await getMedicines();
      const selectedMedicine = allMedicines.find(
        (m) => m.medicine_Id === parseInt(id)
      );
      setMedicine(selectedMedicine);
    };

    fetchMedicineDetails();
  }, [id]);

  // Handle the delete action
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Do you want to delete this pharmacy?"
    );
    if (confirmDelete) {
      try {
        // Call delete service to remove the pharmacy
        await deleteMedicine(id);
        // Navigate back to the pharmacy list after deletion
        navigate("/medicines");
      } catch (error) {
        console.error("Error deleting medicine:", error);
        alert("Error deleting medicine.");
      }
    }
  };

  if (!medicine) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/medicines")}
      >
        Back to Medicines
      </button>
      <div className="card shadow-sm p-4">
        <h3 className="text-primary">Medicine Details</h3>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Generic Name:</strong> {medicine.genericName}
            </p>
            <p>
              <strong>Brand Name:</strong> {medicine.brandName}
            </p>
            <p>
              <strong>Pack Size:</strong> {medicine.packSize}
            </p>
            <p>
              <strong>Dosage Form:</strong> {medicine.dosageForm}
            </p>
            <p>
              <strong>Strength:</strong> {medicine.strength}
            </p>
            <p>
              <strong>Package Type:</strong> {medicine.packageType}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Drug Schedule:</strong> {medicine.drugSchedule}
            </p>
            <p>
              <strong>Shelf Life:</strong> {medicine.shelfLife}
            </p>
            <p>
              <strong>Temperature:</strong> {medicine.temperature}
            </p>
            <p>
              <strong>Type of Drug:</strong> {medicine.typeOfDrug}
            </p>
            <p>
              <strong>Coat:</strong> {medicine.coat}
            </p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card p-3">
              <h5 className="text-secondary">Manufacturer Details</h5>
              <p>
                <strong>Company:</strong> {medicine.manufacturerName}
              </p>
              <p>
                <strong>Country:</strong> {medicine.manufactured_Country}
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3">
              <h5 className="text-secondary">Local Distributor Details</h5>
              <p>
                <strong>Distributor:</strong> {medicine.distributorName}
              </p>
              <p>
                <strong>Contact:</strong> {medicine.distributorContact}
              </p>
              <p>
                <strong>Address:</strong> {medicine.distributorAddress}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 d-flex justify-content-between">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/medicine/update/${medicine.medicine_Id}`)}
          >
            Update
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/medicines")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetails;
