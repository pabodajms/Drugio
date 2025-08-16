import axios from "axios";

const API_URL = "http://localhost:3030/api/dashboard";

export const fetchDashboardData = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
