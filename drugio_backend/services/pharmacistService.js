import db from "../config/db.js";

export const registerPharmacist = ({
  name,
  email,
  firebase_uid,
  contact_number,
  fcm_token,
}) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO pharmacist (name, email, firebase_uid, contact_number, fcm_token)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [name, email, firebase_uid, contact_number, fcm_token],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

export const getPharmacistByFirebaseUid = (firebase_uid) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM pharmacist WHERE firebase_uid = ?`;
    db.query(query, [firebase_uid], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};
