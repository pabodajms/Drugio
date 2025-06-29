import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPharmacies, updatePharmacy } from "../../services/pharmacyServices"; // Assuming updatePharmacy exists
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const UpdatePharmacy = () => {
  const { id } = useParams();
  const [pharmacy, setPharmacy] = useState({
    pharmacyName: "",
    address: "",
    contactNumber: "",
    whatsappNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      const allPharmacies = await getPharmacies();
      const selectedPharmacy = allPharmacies.find(
        (p) => p.pharmacy_Id === parseInt(id)
      );
      setPharmacy({
        pharmacyName: selectedPharmacy.pharmacyName,
        address: selectedPharmacy.address,
        contactNumber: selectedPharmacy.contactNumber,
        whatsappNumber: selectedPharmacy.whatsappNumber,
      });
    };

    fetchPharmacyDetails();
  }, [id]);

  const handleChange = (e) => {
    setPharmacy({ ...pharmacy, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updatePharmacy(id, pharmacy); // Assuming updatePharmacy is implemented
      navigate(`/pharmacies`); // Redirect to pharmacy details page after update
    } catch (err) {
      setError("Failed to update pharmacy. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Update Pharmacy</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Pharmacy Name</label>
          <input
            type="text"
            name="pharmacyName"
            className="form-control"
            value={pharmacy.pharmacyName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={pharmacy.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            className="form-control"
            value={pharmacy.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">WhatsApp Number</label>
          <input
            type="text"
            name="whatsappNumber"
            className="form-control"
            value={pharmacy.whatsappNumber}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update Pharmacy
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(`/pharmacy/${id}`)} // Redirect to pharmacy details if canceled
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdatePharmacy;
