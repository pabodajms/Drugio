import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  respondToPrescription,
  handleGetUserRole,
  getPrescriptionsByFirebaseUid,
  getPrescriptionMonitoring,
  getPrescriptionDetails,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/role/:firebase_uid", handleGetUserRole);
router.post("/upload", uploadPrescription);
router.get("/", getPrescriptions);
router.post("/respond", respondToPrescription);
router.get("/user/:firebase_uid", getPrescriptionsByFirebaseUid);
router.get("/monitoring", getPrescriptionMonitoring);
router.get("/:id", getPrescriptionDetails);

export default router;
