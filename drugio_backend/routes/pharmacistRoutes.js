import express from "express";
import {
  registerPharmacist,
  updatePharmacistToken,
  getPharmacistByFirebaseUid,
} from "../controllers/pharmacistController.js";

const router = express.Router();

router.post("/register", registerPharmacist);
router.post("/update-token", updatePharmacistToken);
router.post("/get-by-firebase-uid", getPharmacistByFirebaseUid);

export default router;
