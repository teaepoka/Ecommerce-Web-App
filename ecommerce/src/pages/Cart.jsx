import { useEffect, useState } from "react";
import { getMyCart, removeFromCart, placeOrder } from "../api/products";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const fetchCart = async () => {
    try {
      const data = await getMyCart();
      setCart(data);
    } catch (err) {
      setError("Could not load your shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (id) => {
    setError("");
    setSuccess("");
    setRemovingId(id);

    try {
      const data = await removeFromCart(id);
      setCart(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not remove product from cart.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to place this order?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setCheckoutLoading(true);

    try {
      const order = await placeOrder();

      setCart({
        items: [],
        totalAmount: 0,
      });

      setSuccess(
        `Order placed successfully! Order number: ${order.orderNumber}`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not place your order.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <p>Loading shopping cart...</p>;

  if (error && !cart) return <p>{error}</p>;

  return (
    <div>
      <h1>Shopping Cart</h1>

      {success && <p>{success}</p>}
      {error && <p>{error}</p>}

      {!cart || cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.id}>
              <h2>{item.productName}</h2>
              <p>Price: {item.productPrice}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: {item.totalAmount}</p>

              <button
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id || checkoutLoading}
              >
                {removingId === item.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}

          <h2>Cart Total: {cart.totalAmount}</h2>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading || removingId !== null}
          >
            {checkoutLoading ? "Processing..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
