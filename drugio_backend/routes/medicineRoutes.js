import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  getBrandsByGeneric,
  getMedicineByBrandId,
} from "../controllers/medicineController.js";

const router = express.Router();

router.get("/", getAllMedicines);
router.get("/search", searchMedicines);
router.get("/brands/:genericName", getBrandsByGeneric);
router.get("/brand/:brandId", getMedicineByBrandId);
router.get("/:id", getMedicineById);
router.post("/", addMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
