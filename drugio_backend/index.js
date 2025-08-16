import express from "express";
import cors from "cors";
import medicineRoutes from "./routes/medicineRoutes.js";
import pharmacyRoutes from "./routes/pharmacyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import pharmacistRoutes from "./routes/pharmacistRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import db from "./config/db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/medicines", medicineRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/distributors", distributorRoutes);
app.use("/api/pharmacists", pharmacistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(3030, "0.0.0.0", () =>
  console.log("Server running on 0.0.0.0:3030")
);
