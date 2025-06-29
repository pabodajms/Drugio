import * as pharmacyService from "../services/pharmacyService.js";

export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await pharmacyService.getAllPharmacies();
    res.status(200).json(pharmacies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await pharmacyService.getPharmacyById(req.params.id);
    res.status(200).json(pharmacy);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addPharmacy = async (req, res) => {
  try {
    await pharmacyService.addPharmacy(req.body);
    res.status(201).json({ message: "Pharmacy added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePharmacy = async (req, res) => {
  try {
    await pharmacyService.updatePharmacy(req.params.id, req.body);
    res.status(200).json({ message: "Pharmacy updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePharmacy = async (req, res) => {
  try {
    await pharmacyService.deletePharmacy(req.params.id);
    res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // default 5km radius
    const pharmacies = await pharmacyService.getNearbyPharmacies(
      lat,
      lng,
      radius
    );
    res.status(200).json(pharmacies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
