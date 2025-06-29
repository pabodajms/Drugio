import {
  getAllManufacturers,
  addManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from "../services/manufacturerService.js";

export const fetchManufacturers = async (req, res) => {
  try {
    const manufacturers = await getAllManufacturers();
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching manufacturers", error });
  }
};

export const createManufacturer = async (req, res) => {
  try {
    const { manufacturer_Name, manufactured_Country } = req.body;
    if (!manufacturer_Name || !manufactured_Country) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newManufacturer = await addManufacturer({
      manufacturer_Name,
      manufactured_Country,
    });
    res.status(201).json({
      message: "Manufacturer added successfully",
      data: newManufacturer,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding manufacturer", error });
  }
};

// Update Manufacturer
export const modifyManufacturer = async (req, res) => {
  try {
    const { manufacturer_Name, manufactured_Country } = req.body;
    const { id } = req.params;

    if (!manufacturer_Name || !manufactured_Country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedManufacturer = await updateManufacturer(id, {
      manufacturer_Name,
      manufactured_Country,
    });

    if (updatedManufacturer.affectedRows === 0) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    res.status(200).json({ message: "Manufacturer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating manufacturer", error });
  }
};

// Delete Manufacturer
export const removeManufacturer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedManufacturer = await deleteManufacturer(id);

    if (deletedManufacturer.affectedRows === 0) {
      return res.status(404).json({ message: "Manufacturer not found" });
    }

    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting manufacturer", error });
  }
};
