import axios from "axios";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: GEOCODING_API_KEY,
        },
      }
    );

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    return null;
  } catch (error) {
    console.error("❌ Geocoding failed for:", address, error.message);
    return null;
  }
}

function queryDb(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

async function updatePharmacyCoordinates() {
  console.log("🔍 Fetching pharmacies without coordinates...");

  try {
    // Get pharmacies that need geocoding
    const pharmacies = await queryDb(
      "SELECT * FROM Pharmacy WHERE latitude IS NULL OR longitude IS NULL"
    );

    if (pharmacies.length === 0) {
      console.log("✅ All pharmacies already have coordinates!");
      return;
    }

    console.log(`📌 Found ${pharmacies.length} pharmacies to geocode...`);

    // Process each pharmacy
    for (const pharmacy of pharmacies) {
      console.log(
        `📍 Geocoding: ${pharmacy.pharmacyName} (${pharmacy.address})`
      );

      const coords = await geocodeAddress(pharmacy.address);

      if (coords) {
        await queryDb(
          "UPDATE Pharmacy SET latitude = ?, longitude = ? WHERE pharmacy_Id = ?",
          [coords.latitude, coords.longitude, pharmacy.pharmacy_Id]
        );
        console.log(`✔ Updated coordinates for ${pharmacy.pharmacyName}`);
      } else {
        console.log(`❌ Failed to geocode: ${pharmacy.address}`);
      }
    }

    console.log("🎉 Geocoding complete!");
  } catch (error) {
    console.error("❌ Database error:", error.message);
  } finally {
    db.end(); // Close the connection
    process.exit();
  }
}

// Run the script
updatePharmacyCoordinates();
