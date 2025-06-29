import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPharmacies, deletePharmacy } from "../../services/pharmacyServices"; // Import deletePharmacy
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const PharmacyDetails = () => {
  const { id } = useParams();
  const [pharmacy, setPharmacy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      const allPharmacies = await getPharmacies();
      const selectedPharmacy = allPharmacies.find(
        (p) => p.pharmacy_Id === parseInt(id)
      );
      setPharmacy(selectedPharmacy);
    };

    fetchPharmacyDetails();
  }, [id]);

  // Handle the delete action
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Do you want to delete this pharmacy?"
    );
    if (confirmDelete) {
      try {
        // Call delete service to remove the pharmacy
        await deletePharmacy(id);
        // Navigate back to the pharmacy list after deletion
        navigate("/pharmacies");
      } catch (error) {
        console.error("Error deleting pharmacy:", error);
        alert("Error deleting pharmacy.");
      }
    }
  };

  if (!pharmacy) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/pharmacies")}
      >
        Back to Pharmacies
      </button>
      <div className="card shadow-sm p-4 text-center">
        <h3 className="text-primary">{pharmacy.pharmacyName}</h3>
        <h5 className="text-secondary">{pharmacy.district}</h5>
        <p>{pharmacy.address}</p>

        <div className="d-flex justify-content-center gap-3 mb-3">
          <button className="btn btn-outline-primary">
            <FaPhone /> Call
          </button>
          <button className="btn btn-outline-success">
            <FaWhatsapp /> WhatsApp
          </button>
        </div>

        <div className="mt-4 d-flex justify-content-between">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/pharmacy/update/${id}`)}
          >
            Update
          </button>
          {/* Updated delete button to trigger confirmation */}
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/pharmacies")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;
