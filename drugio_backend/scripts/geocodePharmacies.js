// Import required modules
const axios = require("axios");
const db = require("../config/db.js"); // Your database connection

// Google Maps API Key (Get one from: https://developers.google.com/maps/documentation/geocoding/get-api-key)
const GEOCODING_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // 🔴 REPLACE THIS!

// Function to convert address → coordinates
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

// Update all pharmacies in the database
async function updatePharmacyCoordinates() {
  console.log("🔍 Fetching pharmacies without coordinates...");

  // Get pharmacies that need geocoding
  const [pharmacies] = await db
    .promise()
    .query(
      "SELECT * FROM Pharmacy WHERE latitude IS NULL OR longitude IS NULL"
    );

  if (pharmacies.length === 0) {
    console.log("✅ All pharmacies already have coordinates!");
    return;
  }

  console.log(`📌 Found ${pharmacies.length} pharmacies to geocode...`);

  // Process each pharmacy
  for (const pharmacy of pharmacies) {
    console.log(`📍 Geocoding: ${pharmacy.pharmacyName} (${pharmacy.address})`);

    const coords = await geocodeAddress(pharmacy.address);

    if (coords) {
      await db
        .promise()
        .query(
          "UPDATE Pharmacy SET latitude = ?, longitude = ? WHERE pharmacy_Id = ?",
          [coords.latitude, coords.longitude, pharmacy.pharmacy_Id]
        );
      console.log(`✔ Updated coordinates for ${pharmacy.pharmacyName}`);
    } else {
      console.log(`❌ Failed to geocode: ${pharmacy.address}`);
    }
  }

  console.log("🎉 Geocoding complete!");
  process.exit(); // Close script when done
}

// Run the script
updatePharmacyCoordinates();
