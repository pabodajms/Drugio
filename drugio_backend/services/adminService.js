export const getAdminDashboard = async (user) => {
  try {
    // Business logic (e.g., fetching data from DB in future)
    return { message: "Welcome, Admin!", user };
  } catch (error) {
    throw new Error("Error fetching admin dashboard data");
  }
};
