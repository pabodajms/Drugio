import db from "../config/db.js";

// ✅ Get user_Id using firebase_uid
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

// ✅ Upload prescription
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
