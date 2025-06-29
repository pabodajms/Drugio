import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPharmacy } from "../../services/pharmacyServices";

const AddPharmacy = () => {
  const [pharmacy, setPharmacy] = useState({
    pharmacyName: "",
    address: "",
    contactNumber: "",
    whatsappNumber: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPharmacy({ ...pharmacy, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addPharmacy(pharmacy);
      navigate("/pharmacies"); // Redirect to pharmacy list after adding
    } catch (err) {
      setError("Failed to add pharmacy. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Pharmacy</h2>
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
          Add Pharmacy
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/pharmacies")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddPharmacy;
