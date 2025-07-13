import express from "express";
import { handleUserRegistration } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", (req, res, next) => {
  // Pass control to the actual controller
  return handleUserRegistration(req, res, next);
});

export default router;
