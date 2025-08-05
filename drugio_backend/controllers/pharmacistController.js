import * as pharmacistService from "../services/pharmacistService.js";

export const registerPharmacist = async (req, res) => {
  const { name, email, firebase_uid, contact_number, fcm_token } = req.body;

  try {
    const existing = await pharmacistService.getPharmacistByFirebaseUid(
      firebase_uid
    );
    if (existing) {
      return res.status(409).json({
        message: "Pharmacist already registered",
        pharmacist: existing,
      });
    }

    const pharmacistId = await pharmacistService.registerPharmacist({
      name,
      email,
      firebase_uid,
      contact_number,
      fcm_token,
    });

    res.status(201).json({ message: "Pharmacist registered", pharmacistId });
  } catch (error) {
    console.error("Pharmacist registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePharmacistToken = async (req, res) => {
  const { firebase_uid, fcm_token } = req.body;
  try {
    const result = await pharmacistService.updatePharmacistToken(
      firebase_uid,
      fcm_token
    );
    res.status(200).json({ message: "Token updated", result });
  } catch (error) {
    console.error("Token update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPharmacistByFirebaseUid = async (req, res) => {
  const { firebase_uid } = req.body;

  try {
    const pharmacist = await pharmacistService.getPharmacistByFirebaseUid(
      firebase_uid
    );
    if (pharmacist) {
      res.status(200).json({ pharmacist });
    } else {
      res.status(404).json({ message: "Pharmacist not found" });
    }
  } catch (error) {
    console.error("Error fetching pharmacist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
