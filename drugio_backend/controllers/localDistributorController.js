import {
  getAllDistributors,
  addDistributor,
  updateDistributor,
  deleteDistributor,
} from "../services/localDistributorService.js";

export const fetchDistributors = async (req, res) => {
  try {
    const distributors = await getAllDistributors();
    res.status(200).json(distributors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching distributors", error });
  }
};

export const createDistributor = async (req, res) => {
  try {
    const { distributor_Name, contact_Number, address } = req.body;
    if (!distributor_Name || !contact_Number || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newDistributor = await addDistributor({
      distributor_Name,
      contact_Number,
      address,
    });
    res.status(201).json({
      message: "Distributor added successfully",
      data: newDistributor,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding distributor", error });
  }
};

// Update Distributor
export const modifyDistributor = async (req, res) => {
  try {
    const { distributor_Name, contact_Number, address } = req.body;
    const { id } = req.params;

    if (!distributor_Name || !contact_Number || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedDistributor = await updateDistributor(id, {
      distributor_Name,
      contact_Number,
      address,
    });

    if (updatedDistributor.affectedRows === 0) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    res.status(200).json({ message: "Distributor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating distributor", error });
  }
};

// Delete Distributor
export const removeDistributor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDistributor = await deleteDistributor(id);

    if (deletedDistributor.affectedRows === 0) {
      return res.status(404).json({ message: "Distributor not found" });
    }

    res.status(200).json({ message: "Distributor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting distributor", error });
  }
};
