import express from "express";
import {
  fetchDistributors,
  createDistributor,
  modifyDistributor,
  removeDistributor,
} from "../controllers/localDistributorController.js";

const router = express.Router();

router.get("/", fetchDistributors);
router.post("/", createDistributor);
router.put("/:id", modifyDistributor);
router.delete("/:id", removeDistributor);

export default router;
