import express from "express";
import { verifyFirebaseToken } from "../middlewares/authMiddleware.js";
import {
  adminDashboard,
  registerAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", verifyFirebaseToken, adminDashboard);
router.post("/signup", registerAdmin);

export default router;
