import db from "../config/db.js";

export const registerUser = ({ firebase_uid, fcm_token }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO user (firebase_uid, fcm_token)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE fcm_token = VALUES(fcm_token)
    `;
    db.query(query, [firebase_uid, fcm_token], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
