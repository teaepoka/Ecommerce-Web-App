import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import MyProducts from "./pages/MyProducts";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Header />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<ProductList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        {/* Private pages */}
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />

        <Route
          path="/my-orders"
          element={
            <RequireAuth>
              <MyOrders />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/my-products"
          element={
            <RequireAuth>
              <MyProducts />
            </RequireAuth>
          }
        />

        <Route
          path="/my-products/create"
          element={
            <RequireAuth>
              <CreateProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/my-products/edit/:id"
          element={
            <RequireAuth>
              <EditProduct />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
