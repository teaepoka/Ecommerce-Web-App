import api from "./client";

// Get the logged-in user's profile
export const getProfile = async () => {
  const response = await api.get("/api/User/profile");
  return response.data;
};

// Get the logged-in user's wallet balance
export const getBalance = async () => {
  const response = await api.get("/api/User/balance");
  return response.data;
};

// Add money to the user's wallet
export const updateBalance = async (amount) => {
  const response = await api.post("/api/User/updateBalance", null, {
    params: {
      amount: Number(amount),
    },
  });

  return response.data;
};
