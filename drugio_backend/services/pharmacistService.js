import db from "../config/db.js";

export const registerPharmacist = ({
  name,
  registration_number,
  email,
  firebase_uid,
  contact_number,
  fcm_token,
}) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO pharmacist (name, registration_number, email, firebase_uid, contact_number, fcm_token)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        name,
        registration_number,
        email,
        firebase_uid,
        contact_number,
        fcm_token,
      ],
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

export const updatePharmacistToken = (firebase_uid, fcm_token) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE pharmacist SET fcm_token = ? WHERE firebase_uid = ?
    `;
    db.query(query, [fcm_token, firebase_uid], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
