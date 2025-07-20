import * as prescriptionService from "../services/prescriptionService.js";

export const uploadPrescription = async (req, res) => {
  console.log("📥 Received request at /prescriptions/upload");
  console.log("Body:", req.body);
  try {
    console.log("📥 Incoming request to /prescriptions/upload");

    // Log request body
    console.log("📦 Request body:", req.body);

    const { user_Id: firebase_uid, image_url, comment } = req.body;

    if (!firebase_uid || !image_url) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("🔍 Looking up user_Id from firebase_uid:", firebase_uid);
    const numericUserId = await prescriptionService.getUserIdFromFirebaseUid(
      firebase_uid
    );

    if (!numericUserId) {
      console.warn("❌ User not found for firebase_uid:", firebase_uid);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Found numeric user_Id:", numericUserId);
    console.log("💾 Saving prescription to database...");

    const prescriptionId = await prescriptionService.uploadPrescription({
      user_Id: numericUserId,
      image_url,
      comment,
    });

    console.log("🎉 Prescription saved with ID:", prescriptionId);
    res.status(201).json({ message: "Prescription uploaded", prescriptionId });
  } catch (error) {
    console.error("🔥 Error in uploadPrescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
