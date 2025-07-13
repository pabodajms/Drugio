import * as pharmacistService from "../services/pharmacistService.js";

export const registerPharmacist = async (req, res) => {
  const { name, email, firebase_uid, contact_number, fcm_token } = req.body;

  try {
    const existing = await pharmacistService.getPharmacistByFirebaseUid(
      firebase_uid
    );
    if (existing) {
      return res
        .status(409)
        .json({
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
