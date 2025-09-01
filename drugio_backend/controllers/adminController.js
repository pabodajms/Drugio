import { getAdminDashboard } from "../services/adminService.js";
import db from "../config/db.js";
import admin from "../config/firebaseAdmin.js";

export const adminDashboard = async (req, res) => {
  try {
    const data = await getAdminDashboard(req.user);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let firebaseUid = null;

    // Check if the user already exists in Firebase
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      firebaseUid = userRecord.uid; // Assign UID if user exists
      console.log("User already exists in Firebase:", firebaseUid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // If user doesn't exist, create new one
        const newUser = await admin.auth().createUser({ email, password });
        firebaseUid = newUser.uid;
        console.log("New Firebase user created:", firebaseUid);
      } else {
        throw error; // Throw error if it's something else
      }
    }

    // Ensure firebaseUid is correctly set before using it
    if (!firebaseUid) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve Firebase UID" });
    }

    // Check if user already exists in MySQL
    db.query(
      "SELECT * FROM admins WHERE firebase_uid = ?",
      [firebaseUid],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          return res
            .status(409)
            .json({ message: "Admin already registered in MySQL" });
        }

        // Insert user into MySQL if not exists
        db.query(
          "INSERT INTO admins (firebase_uid, email, created_at) VALUES (?, ?, NOW())",
          [firebaseUid, email],
          (err, result) => {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ message: "Database error" });
            }

            res.status(201).json({
              message: "Admin registered successfully",
              admin_Id: result.insertId,
              firebase_uid: firebaseUid,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};
