import axios from "axios";

const API_URL = "http://localhost:3030/api/medicines";

// Fetch all medicines
export const getMedicines = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching medicines:", error);
    return [];
  }
};

// Add a new medicine (along with manufacturer and distributor details)
export const addMedicine = async (medicineData) => {
  try {
    console.log("Sending full medicine data to backend:", medicineData);

    // Send everything in one request — backend handles related inserts
    const response = await axios.post(API_URL, medicineData);

    console.log("Medicine Added Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding medicine:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateMedicine = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating medicine:", error);
    throw error;
  }
};

// Delete a medicine
export const deleteMedicine = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting medicine with ID ${id}:`, error);
    return false;
  }
};
