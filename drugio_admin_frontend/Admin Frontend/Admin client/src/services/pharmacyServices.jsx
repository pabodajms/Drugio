import axios from "axios";

const API_URL = "http://localhost:3030/api/pharmacies"; // Update with your actual backend URL

// Fetch all pharmacies
export const getPharmacies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return [];
  }
};

// Fetch a single pharmacy by ID
export const getPharmacyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pharmacy with ID ${id}:`, error);
    return null;
  }
};

// Add a new pharmacy
export const addPharmacy = async (pharmacyData) => {
  try {
    const response = await axios.post(API_URL, pharmacyData);
    return response.data;
  } catch (error) {
    console.error("Error adding pharmacy:", error);
    throw error;
  }
};

// Update an existing pharmacy
export const updatePharmacy = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating pharmacy with ID ${id}:`, error);
    return null;
  }
};

// Delete a pharmacy
export const deletePharmacy = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting pharmacy with ID ${id}:`, error);
    return false;
  }
};
