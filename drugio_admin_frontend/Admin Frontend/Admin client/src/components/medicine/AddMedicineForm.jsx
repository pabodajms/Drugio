import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMedicine } from "../../services/medicineServices";
import "bootstrap/dist/css/bootstrap.min.css";

const AddMedicineForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    genericName: "",
    brandName: "",
    packSize: "",
    dosageForm: "",
    strength: "",
    drugSchedule: "",
    shelfLife: "",
    typeOfDrug: "",
    packageType: "",
    temperature: "",
    coat: "",
    manufacturerName: "",
    manufactured_Country: "",
    localDistributorName: "",
    localDistributorContact: "",
    localDistributorAddress: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMedicine(formData);
      navigate("/medicines");
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Generic Name</label>
          <input
            type="text"
            className="form-control"
            name="genericName"
            value={formData.genericName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Drug Schedule</label>
          <input
            type="text"
            className="form-control"
            name="drugSchedule"
            value={formData.drugSchedule}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Brand Name</label>
          <input
            type="text"
            className="form-control"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Shelf Life</label>
          <input
            type="text"
            className="form-control"
            name="shelfLife"
            value={formData.shelfLife}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Pack Size</label>
          <input
            type="text"
            className="form-control"
            name="packSize"
            value={formData.packSize}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Type of Drug</label>
          <input
            type="text"
            className="form-control"
            name="typeOfDrug"
            value={formData.typeOfDrug}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Dosage Form</label>
          <input
            type="text"
            className="form-control"
            name="dosageForm"
            value={formData.dosageForm}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Package Type</label>
          <input
            type="text"
            className="form-control"
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label>Strength</label>
          <input
            type="text"
            className="form-control"
            name="strength"
            value={formData.strength}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Temperature</label>
          <input
            type="text"
            className="form-control"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-12 mb-3">
          <label>Coat</label>
          <input
            type="text"
            className="form-control"
            name="coat"
            value={formData.coat}
            onChange={handleChange}
          />
        </div>
      </div>

      <h5 className="mt-4">Manufacturer Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Manufactured Company</label>
          <input
            type="text"
            className="form-control"
            name="manufacturerName"
            value={formData.manufacturerName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Manufactured Country</label>
          <input
            type="text"
            className="form-control"
            name="manufactured_Country"
            value={formData.manufactured_Country}
            onChange={handleChange}
          />
        </div>
      </div>

      <h5 className="mt-4">Local Distributor Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Local Distributor</label>
          <input
            type="text"
            className="form-control"
            name="localDistributorName"
            value={formData.localDistributorName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Contact Number</label>
          <input
            type="text"
            className="form-control"
            name="localDistributorContact"
            value={formData.localDistributorContact}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12 mb-3">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            name="localDistributorAddress"
            value={formData.localDistributorAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary px-5">
          Add
        </button>
        <button
          type="button"
          className="btn btn-secondary px-4 ms-3"
          onClick={() => navigate("/medicines")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMedicineForm;
