import express from "express";
import {
  fetchManufacturers,
  createManufacturer,
  modifyManufacturer,
  removeManufacturer,
} from "../controllers/manufacturerController.js";

const router = express.Router();

router.get("/", fetchManufacturers);
router.post("/", createManufacturer);
router.put("/:id", modifyManufacturer);
router.delete("/:id", removeManufacturer);

export default router;
