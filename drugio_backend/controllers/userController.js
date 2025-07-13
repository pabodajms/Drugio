import { registerUser } from "../services/userService.js";

export const handleUserRegistration = async (req, res) => {
  try {
    const { firebase_uid, fcm_token } = req.body;

    if (!firebase_uid || !fcm_token) {
      return res
        .status(400)
        .json({ message: "firebase_uid and fcm_token are required" });
    }

    await registerUser({ firebase_uid, fcm_token });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
