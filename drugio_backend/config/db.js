import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "drugioDB",
  port: process.env.DB_PORT || 3307,
  multipleStatements: true, // Enable multiple queries
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// Handle MySQL disconnects
db.on("error", (err) => {
  console.error("MySQL error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("🔄 Reconnecting to MySQL...");
    db.connect();
  } else {
    throw err;
  }
});

export default db;
