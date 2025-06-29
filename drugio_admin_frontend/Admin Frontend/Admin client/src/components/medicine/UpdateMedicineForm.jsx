import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMedicines, updateMedicine } from "../../services/medicineServices";

const UpdateMedicineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchMedicine = async () => {
      const allMedicines = await getMedicines();
      const medicine = allMedicines.find((m) => m.medicine_Id === parseInt(id));
      if (medicine) setFormData(medicine);
    };
    fetchMedicine();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMedicine(id, formData);
      navigate("/medicines");
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  if (!formData) return <p className="text-center">Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="shadow p-4 bg-white rounded">
      <h3 className="mb-4 text-primary">Update Medicine</h3>
      <div className="row">
        {[
          "genericName",
          "brandName",
          "packSize",
          "dosageForm",
          "strength",
          "drugSchedule",
          "shelfLife",
          "typeOfDrug",
          "packageType",
          "temperature",
          "specialAdvice",
        ].map((field) => (
          <div className="col-md-6 mb-3" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1")}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <h5 className="mt-4">Manufacturer Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Manufactured Company</label>
          <input
            type="text"
            className="form-control"
            name="manufacturerName"
            value={formData.manufacturerName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Manufactured Country</label>
          <input
            type="text"
            className="form-control"
            name="manufactured_Country"
            value={formData.manufactured_Country || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <h5 className="mt-4">Local Distributor Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Distributor Name</label>
          <input
            type="text"
            className="form-control"
            name="distributorName"
            value={formData.distributorName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label>Contact Number</label>
          <input
            type="text"
            className="form-control"
            name="distributorContact"
            value={formData.distributorContact || ""}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12 mb-3">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            name="distributorAddress"
            value={formData.distributorAddress || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center mt-4">
        <button type="submit" className="btn btn-success px-5">
          Update
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

export default UpdateMedicineForm;
