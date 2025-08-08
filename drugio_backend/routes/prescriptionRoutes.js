import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  respondToPrescription,
  handleGetUserRole,
  getPrescriptionsByFirebaseUid,
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/role/:firebase_uid", handleGetUserRole);
router.post("/upload", uploadPrescription);
router.get("/", getPrescriptions);
router.post("/respond", respondToPrescription);
router.get("/user/:firebase_uid", getPrescriptionsByFirebaseUid);

export default router;
