import express from "express";
import { registerPharmacist } from "../controllers/pharmacistController.js";

const router = express.Router();

router.post("/register", registerPharmacist);

export default router;
