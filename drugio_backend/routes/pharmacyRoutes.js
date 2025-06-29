import express from "express";
import {
  getAllPharmacies,
  getPharmacyById,
  addPharmacy,
  updatePharmacy,
  deletePharmacy,
  getNearbyPharmacies,
} from "../controllers/pharmacyController.js";

const router = express.Router();

router.get("/", getAllPharmacies);
router.get("/nearby", getNearbyPharmacies);
router.get("/:id", getPharmacyById);
router.post("/", addPharmacy);
router.put("/:id", updatePharmacy);
router.delete("/:id", deletePharmacy);

export default router;
