import admin from "firebase-admin";
import * as prescriptionService from "../services/prescriptionService.js";

export const uploadPrescription = async (req, res) => {
  try {
    const { user_Id: firebase_uid, image_url, comment } = req.body;

    if (!firebase_uid || !image_url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const numericUserId = await prescriptionService.getUserIdFromFirebaseUid(
      firebase_uid
    );
    if (!numericUserId)
      return res.status(404).json({ message: "User not found" });

    const prescriptionId = await prescriptionService.uploadPrescription({
      user_Id: numericUserId,
      image_url,
      comment,
    });

    // Send notifications to all pharmacists
    const tokens = await prescriptionService.getPharmacistFcmTokens();
    if (tokens.length > 0) {
      const messaging = admin.messaging();

      const response = await messaging.sendEachForMulticast({
        tokens,
        notification: {
          title: "New Prescription Uploaded",
          body: "A user just uploaded a prescription. Check it out!",
        },
      });

      console.log(`Notification sent to ${response.successCount} pharmacists`);
    } else {
      console.log("No FCM tokens found for pharmacists.");
    }

    res.status(201).json({ message: "Prescription uploaded", prescriptionId });
  } catch (error) {
    console.error("Error in uploadPrescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionService.getAllPrescriptions();
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Submit pharmacist response
export const respondToPrescription = async (req, res) => {
  const {
    prescription_Id,
    pharmacist_Id,
    suggested_medicines,
    directions,
    pharmacist_comment,
  } = req.body;

  if (!prescription_Id || !pharmacist_Id || !suggested_medicines) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const responseId = await prescriptionService.savePharmacistResponse({
      prescription_Id,
      pharmacist_Id,
      suggested_medicines,
      directions,
      pharmacist_comment,
    });

    res.status(201).json({ message: "Response saved", responseId });
  } catch (error) {
    console.error("Error saving pharmacist response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetUserRole = async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const role = await prescriptionService.getUserRoleByFirebaseUid(
      firebase_uid
    );
    res.status(role === "unknown" ? 404 : 200).json({ role });
  } catch (error) {
    console.error("Error in role check:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrescriptionsByFirebaseUid = async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const numericId = await prescriptionService.getUserIdFromFirebaseUid(
      firebase_uid
    );
    if (!numericId) {
      return res.status(404).json({ message: "User not found" });
    }

    const prescriptions =
      await prescriptionService.getPrescriptionsWithResponsesByUserId(
        numericId
      );
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions with responses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrescriptionMonitoring = async (req, res) => {
  try {
    const data = await prescriptionService.getPrescriptionMonitoring();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPrescriptionDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const prescription = await prescriptionService.getPrescriptionDetails(id);
    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.status(200).json(prescription);
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
