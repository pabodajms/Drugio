import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  respondToPrescription,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/upload", uploadPrescription);
router.get("/", getPrescriptions);
router.post("/respond", respondToPrescription);

export default router;
