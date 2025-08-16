// controllers/dashboardController.js
import * as dashboardService from "../services/dashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
