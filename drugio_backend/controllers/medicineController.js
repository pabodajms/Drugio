import * as medicineService from "../services/medicineService.js";

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    res.status(200).json(medicines);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMedicineById = async (req, res) => {
  try {
    const medicine = await medicineService.getMedicineById(req.params.id);
    res.status(200).json(medicine);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addMedicine = async (req, res) => {
  try {
    await medicineService.addMedicine(req.body);
    res.status(201).json({ message: "Medicine added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    await medicineService.updateMedicine(req.params.id, req.body);
    res.status(200).json({ message: "Medicine updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    await medicineService.deleteMedicine(req.params.id);
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const searchMedicines = async (req, res) => {
  try {
    const { query, filter } = req.query;
    const results = await medicineService.searchMedicines(filter, query);
    if (results.length === 0) {
      res.status(404).json({ message: "Medicine not found" });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getBrandsByGeneric = async (req, res) => {
  try {
    const genericName = req.params.genericName;
    const brands = await medicineService.getBrandsByGeneric(genericName);
    if (brands.length === 0) {
      res.status(404).json({ message: "No brands found for this generic" });
    } else {
      res.status(200).json(brands);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMedicineByBrandId = async (req, res) => {
  try {
    const medicine = await medicineService.getMedicineByBrandId(
      req.params.brandId
    );
    res.status(200).json(medicine);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
