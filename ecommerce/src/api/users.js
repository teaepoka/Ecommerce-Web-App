import api from "./client";

// Get the logged-in user's profile
export const getProfile = async () => {
  const response = await api.get("/api/User/profile");
  return response.data;
};

/* Add money to the user's wallet
export const updateBalance = async (amount) => {
  const response = await api.post("/api/User/updateBalance", amount);
  return response.data;
};*/

/*
export const updateBalance = async (amount) => {
  const response = await api.post(
    "/api/User/updateBalance",
    JSON.stringify(amount),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};*/

export const updateBalance = async (amount) => {
  try {
    const response = await api.post("/api/User/updateBalance", amount);

    console.log("Balance response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Balance error:", error.response?.data);
    console.log("Status:", error.response?.status);
    console.log("Request data:", error.config?.data);
    console.log("Request headers:", error.config?.headers);

    throw error;
  }
};
