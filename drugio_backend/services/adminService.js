export const getAdminDashboard = async (user) => {
  try {
    return { message: "Welcome, Admin!", user };
  } catch (error) {
    throw new Error("Error fetching admin dashboard data");
  }
};
