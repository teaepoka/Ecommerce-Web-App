import api from "./client";

// Get all products
export const getAllProducts = async () => {
  const response = await api.get("/api/Product/all");

  return response.data;
};

// Get active products with filters
export const getActiveProducts = async (filters) => {
  const response = await api.post("/api/Product/active", filters);

  return response.data;
};

// Get one product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/api/Product/${id}`);

  return response.data;
};

// Get products belonging to the logged-in user
export const getMyProducts = async () => {
  const response = await api.get("/api/Product/my-products");

  return response.data;
};

// Create a new product
export const createProduct = async (productData) => {
  const response = await api.post("/api/Product/create", productData);
  return response.data;
};

// Update an existing product
export const updateProduct = async (productData) => {
  const response = await api.post("/api/Product/update", productData);
  return response.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const response = await api.post(`/api/Product/delete/${id}`);
  return response.data;
};

// Add a product to the cart
export const addToCart = async (productId, quantity) => {
  const response = await api.post("/api/Product/add-to-cart", {
    productId,
    quantity,
  });

  return response.data;
};

// Get the logged-in user's shopping cart
export const getMyCart = async () => {
  const response = await api.get("/api/Product/my-cart");
  return response.data;
};

// Remove a product from the cart
export const removeFromCart = async (id) => {
  const response = await api.post(`/api/Product/remove-from-cart/${id}`);

  return response.data;
};

// Place an order using the shopping cart
export const placeOrder = async () => {
  const response = await api.post("/api/Product/place-order");
  return response.data;
};

// Get orders belonging to the logged-in user
export const getMyOrders = async () => {
  const response = await api.get("/api/Product/my-orders");
  return response.data;
};
