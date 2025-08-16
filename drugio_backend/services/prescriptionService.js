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

export const getUserRoleByFirebaseUid = (firebase_uid) => {
  return new Promise((resolve, reject) => {
    const queryPharmacist = "SELECT * FROM pharmacist WHERE firebase_uid = ?";
    const queryUser = "SELECT * FROM user WHERE firebase_uid = ?";

    db.query(queryPharmacist, [firebase_uid], (err, pharmacistResult) => {
      if (err) return reject("Error checking pharmacist role: " + err);

      if (pharmacistResult.length > 0) {
        return resolve("pharmacist");
      }

      db.query(queryUser, [firebase_uid], (err2, userResult) => {
        if (err2) return reject("Error checking user role: " + err2);

        if (userResult.length > 0) {
          return resolve("user");
        }

        return resolve("unknown");
      });
    });
  });
};

export const getPrescriptionsWithResponsesByUserId = (user_Id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        p.prescription_Id,
        p.image_url,
        p.comment,
        p.uploaded_at,
        r.response_Id,
        r.suggested_medicines,
        r.directions,
        r.pharmacist_comment,
        r.created_at AS response_date
      FROM prescriptions p
      LEFT JOIN prescription_response r
        ON p.prescription_Id = r.prescription_Id
      WHERE p.user_Id = ?
      ORDER BY p.uploaded_at DESC, r.created_at DESC
    `;

    db.query(query, [user_Id], (err, results) => {
      if (err) {
        console.error("Error fetching prescriptions with responses:", err);
        return reject(err);
      }

      // Group responses under each prescription
      const prescriptionsMap = {};
      results.forEach((row) => {
        if (!prescriptionsMap[row.prescription_Id]) {
          prescriptionsMap[row.prescription_Id] = {
            prescription_Id: row.prescription_Id,
            image_url: row.image_url,
            comment: row.comment,
            uploaded_at: row.uploaded_at,
            responses: [],
          };
        }
        if (row.response_Id) {
          prescriptionsMap[row.prescription_Id].responses.push({
            response_id: row.response_Id,
            suggested_medicines: row.suggested_medicines,
            directions: row.directions,
            pharmacist_comment: row.pharmacist_comment,
            response_date: row.response_date,
          });
        }
      });

      resolve(Object.values(prescriptionsMap));
    });
  });
};

// Get prescription monitoring data for admin/web
export const getPrescriptionMonitoring = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        p.prescription_Id,
        p.uploaded_at,
        p.user_Id,
        COUNT(r.response_Id) AS response_count,
        CASE 
          WHEN COUNT(r.response_Id) > 0 THEN 'Responded'
          ELSE 'Pending'
        END AS status
      FROM prescriptions p
      LEFT JOIN prescription_response r 
        ON p.prescription_Id = r.prescription_Id
      GROUP BY p.prescription_Id
      ORDER BY p.uploaded_at DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching prescription monitoring data:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Get prescription details by prescription_Id
export const getPrescriptionDetails = (prescription_Id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        p.prescription_Id,
        p.user_Id,
        p.image_url,
        p.comment,
        p.uploaded_at,
        r.response_Id,
        r.suggested_medicines,
        r.directions,
        r.pharmacist_comment,
        r.created_at AS response_date,
        ph.name AS pharmacist_name
      FROM prescriptions p
      LEFT JOIN prescription_response r 
        ON p.prescription_Id = r.prescription_Id
      LEFT JOIN pharmacist ph 
        ON r.pharmacist_Id = ph.pharmacist_Id
      WHERE p.prescription_Id = ?
      ORDER BY r.created_at DESC
    `;

    db.query(query, [prescription_Id], (err, results) => {
      if (err) {
        console.error("Error fetching prescription details:", err);
        return reject(err);
      }

      if (results.length === 0) return resolve(null);

      const prescription = {
        prescription_Id: results[0].prescription_Id,
        user_Id: results[0].user_Id,
        image_url: results[0].image_url,
        comment: results[0].comment,
        uploaded_at: results[0].uploaded_at,
        responses: [],
      };

      results.forEach((row) => {
        if (row.response_Id) {
          prescription.responses.push({
            response_Id: row.response_Id,
            pharmacist_name: row.pharmacist_name,
            suggested_medicines: row.suggested_medicines,
            directions: row.directions,
            pharmacist_comment: row.pharmacist_comment,
            response_date: row.response_date,
          });
        }
      });

      resolve(prescription);
    });
  });
};
