
import api from "./client";

// Save authentication information
const saveAuth = (data) => {
  if (data.success && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

// Register a new user
export const register = async (userData) => {
  const response = await api.post("/api/Auth/register", userData);

  saveAuth(response.data);

  return response.data;
};

// Login an existing user
export const login = async (userData) => {
  const response = await api.post("/api/Auth/login", userData);

  saveAuth(response.data);

  return response.data;
};

// Logout the user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
