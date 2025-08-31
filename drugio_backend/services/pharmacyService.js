import db from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

// Get all pharmacies
export const getAllPharmacies = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM Pharmacy", (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// Get a single pharmacy by ID
export const getPharmacyById = async (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM Pharmacy WHERE pharmacy_Id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else if (result.length === 0) reject(new Error("Pharmacy not found"));
        else resolve(result[0]);
      }
    );
  });
};

// Add a new pharmacy
// export const addPharmacy = async (pharmacyData) => {
//   const sql =
//     "INSERT INTO Pharmacy (pharmacyName, contactNumber, whatsappNumber, address) VALUES (?, ?, ?, ?)";
//   return new Promise((resolve, reject) => {
//     db.query(
//       sql,
//       [
//         pharmacyData.pharmacyName,
//         pharmacyData.contactNumber,
//         pharmacyData.whatsappNumber,
//         pharmacyData.address,
//       ],
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//   });
// };
// Add a new pharmacy with geocoding
export const addPharmacy = async (pharmacyData) => {
  try {
    // Call Google Geocoding API
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: pharmacyData.address,
          key: GEOCODING_API_KEY,
        },
      }
    );

    if (
      geoResponse.data.status === "OK" &&
      geoResponse.data.results.length > 0
    ) {
      const location = geoResponse.data.results[0].geometry.location;
      pharmacyData.latitude = location.lat;
      pharmacyData.longitude = location.lng;
    } else {
      throw new Error("Unable to fetch coordinates for the given address");
    }

    // Save to DB
    const sql =
      "INSERT INTO Pharmacy (pharmacyName, contactNumber, whatsappNumber, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          pharmacyData.pharmacyName,
          pharmacyData.contactNumber,
          pharmacyData.whatsappNumber,
          pharmacyData.address,
          pharmacyData.latitude,
          pharmacyData.longitude,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Update a pharmacy
// export const updatePharmacy = async (id, pharmacyData) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       "UPDATE Pharmacy SET pharmacyName = ?, contactNumber = ?, whatsappNumber = ?, address = ? WHERE pharmacy_Id = ?",
//       [
//         pharmacyData.pharmacyName,
//         pharmacyData.contactNumber,
//         pharmacyData.whatsappNumber,
//         pharmacyData.address,
//         id,
//       ],
//       (err, result) => {
//         if (err) reject(err);
//         else resolve(result);
//       }
//     );
//   });
// };

export const updatePharmacy = async (id, pharmacyData) => {
  try {
    // If address is updated, fetch new lat/lng
    if (pharmacyData.address) {
      const geoResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: { address: pharmacyData.address, key: GEOCODING_API_KEY },
        }
      );

      if (
        geoResponse.data.status === "OK" &&
        geoResponse.data.results.length > 0
      ) {
        const location = geoResponse.data.results[0].geometry.location;
        pharmacyData.latitude = location.lat;
        pharmacyData.longitude = location.lng;
      }
    }

    const sql =
      "UPDATE Pharmacy SET pharmacyName = ?, contactNumber = ?, whatsappNumber = ?, address = ?, latitude = ?, longitude = ? WHERE pharmacy_Id = ?";
    return new Promise((resolve, reject) => {
      db.query(
        sql,
        [
          pharmacyData.pharmacyName,
          pharmacyData.contactNumber,
          pharmacyData.whatsappNumber,
          pharmacyData.address,
          pharmacyData.latitude,
          pharmacyData.longitude,
          id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// Delete a pharmacy
export const deletePharmacy = async (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM Pharmacy WHERE pharmacy_Id = ?",
      [id],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

export const getNearbyPharmacies = async (lat, lng, radius) => {
  return new Promise((resolve, reject) => {
    // Haversine formula to calculate distance
    const sql = `
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
      sin(radians(latitude)))) AS distance 
      FROM Pharmacy 
      HAVING distance < ? 
      ORDER BY distance 
      LIMIT 20
    `;

    db.query(sql, [lat, lng, lat, radius], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
