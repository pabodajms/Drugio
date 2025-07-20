import express from "express";
import { uploadPrescription } from "../controllers/prescriptionController.js";

const router = express.Router();

router.post("/upload", uploadPrescription);

export default router;
