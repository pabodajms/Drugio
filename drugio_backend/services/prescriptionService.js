import db from "../config/db.js";

// Get user_Id using firebase_uid
export const getUserIdFromFirebaseUid = (firebase_uid) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT user_Id FROM user WHERE firebase_uid = ?";
    db.query(query, [firebase_uid], (err, results) => {
      if (err) {
        console.error("Error fetching user_Id from firebase_uid:", err);
        return reject(err);
      }
      if (results.length === 0) return resolve(null);
      resolve(results[0].user_Id);
    });
  });
};

// Upload prescription
export const uploadPrescription = ({ user_Id, image_url, comment }) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO prescriptions (user_Id, image_url, comment) VALUES (?, ?, ?)";
    db.query(query, [user_Id, image_url, comment], (err, result) => {
      if (err) {
        console.error("Error inserting prescription:", err);
        return reject(err);
      }
      resolve(result.insertId);
    });
  });
};

// Get all pharmacist FCM tokens
export const getPharmacistFcmTokens = () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT fcm_token FROM pharmacist WHERE fcm_token IS NOT NULL";
    db.query(query, (err, rows) => {
      if (err) {
        console.error("Error fetching pharmacist FCM tokens:", err);
        return reject(err);
      }
      const tokens = rows.map((row) => row.fcm_token).filter(Boolean);
      resolve(tokens);
    });
  });
};

// Get all prescriptions
export const getAllPrescriptions = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM prescriptions ORDER BY uploaded_at DESC";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching prescriptions:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Save pharmacist response
export const savePharmacistResponse = ({
  prescription_Id,
  pharmacist_Id,
  suggested_medicines,
  directions,
  pharmacist_comment,
}) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO prescription_response
      (prescription_Id, pharmacist_Id, suggested_medicines, directions, pharmacist_comment)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        prescription_Id,
        pharmacist_Id,
        suggested_medicines,
        directions,
        pharmacist_comment,
      ],
      (err, result) => {
        if (err) {
          console.error("Error saving response:", err);
          return reject(err);
        }
        resolve(result.insertId);
      }
    );
  });
};
