import axios from "axios";

const API_URL = "http://localhost:3030/api/prescriptions";

export const getPrescriptionMonitoring = async () => {
  try {
    const response = await axios.get(`${API_URL}/monitoring`);
    return response.data;
  } catch (error) {
    console.error("Error fetching monitoring data:", error);
    throw error;
  }
};

export const getPrescriptionDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    throw error;
  }
};
