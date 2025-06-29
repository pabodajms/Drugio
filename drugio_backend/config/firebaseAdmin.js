import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("config/firebaseAdmin.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("⚠️ Firebase Admin JSON file not found!");
  process.exit(1); // Stop execution if the file is missing
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK only if it's not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
