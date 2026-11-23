import { useEffect, useState } from "react";
import { getMyCart, removeFromCart, placeOrder } from "../api/products";
import { getBalance } from "../api/users";
import { Link } from "react-router";

function Cart() {
  const [cart, setCart] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const fetchCart = async () => {
    const data = await getMyCart();
    setCart(data);
  };

  const fetchBalance = async () => {
    const data = await getBalance();
    setBalance(Number(data));
  };

  useEffect(() => {
    const loadCartAndBalance = async () => {
      try {
        await Promise.all([fetchCart(), fetchBalance()]);
      } catch (err) {
        setError("Could not load your cart or wallet balance.");
      } finally {
        setLoading(false);
      }
    };

    loadCartAndBalance();
  }, []);

  const handleRemove = async (id) => {
    setError("");
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
    if (!cart || cart.items.length === 0) return;

    if (cart.totalAmount > balance) {
      setError("You do not have enough money in your wallet.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to place this order for ${cart.totalAmount}?`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setCheckingOut(true);

    try {
      const order = await placeOrder();

      setCart({ items: [], totalAmount: 0 });
      setMessage(
        `Your order has been placed successfully! Order number: ${order.orderNumber}`,
      );

      try {
        await fetchBalance();
      } catch {
        // The order was successful even if refreshing the balance fails.
      }
    } catch (err) {
      console.log("CHECKOUT ERROR:", err.response?.data || err.message);

      setError(err.response?.data?.message || "Could not place your order.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading shopping cart...</p>;
  }

  if (error && !cart) {
    return <p className="status-message">{error}</p>;
  }

  const insufficientBalance =
    balance !== null && cart && cart.totalAmount > balance;

  if (!cart || cart.items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-heading">
          <p className="section-label">CYBERMERCE / SHOPPING TERMINAL</p>
          <h1>
            YOUR <span>CART</span>
          </h1>
        </div>

        {message && <p className="cart-success">{message}</p>}
        {error && <p className="cart-error">{error}</p>}

        <section className="empty-cart">
          <div className="empty-cart-icon">[ 0 ]</div>
          <h2>YOUR CART IS EMPTY</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping">
            EXPLORE PRODUCTS
          </Link>
        </section>

        {balance !== null && (
          <div className="empty-cart-balance">
            WALLET BALANCE:{" "}
            <strong>{balance.toLocaleString("sq-AL")} ALL</strong>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <p className="section-label">CYBERMERCE / SHOPPING TERMINAL</p>
        <h1>
          YOUR <span>CART</span>
        </h1>
        <p>Review your items before completing your order.</p>
      </div>

      {error && <p className="cart-error">{error}</p>}
      {message && <p className="cart-success">{message}</p>}

      <div className="cart-layout">
        <section className="cart-items-section">
          <div className="cart-section-heading">
            <h2>SELECTED ITEMS</h2>
            <span>{cart.items.length} ITEMS</span>
          </div>

          {cart.items.map((item) => (
            <article className="cart-item-card" key={item.id}>
              <div className="cart-item-info">
                <h3>{item.productName}</h3>

                <p>
                  PRICE: {Number(item.productPrice).toLocaleString("sq-AL")} ALL
                </p>

                <p>QUANTITY: {item.quantity}</p>

                <strong>
                  {Number(item.totalAmount).toLocaleString("sq-AL")} ALL
                </strong>
              </div>

              <button
                className="remove-cart-button"
                onClick={() => handleRemove(item.id)}
                disabled={removingId === item.id || checkingOut}
              >
                {removingId === item.id ? "REMOVING..." : "REMOVE"}
              </button>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <p className="section-label">ORDER SUMMARY</p>
          <h2>CHECKOUT</h2>

          <div className="summary-line">
            <span>Items</span>
            <strong>{cart.items.length}</strong>
          </div>

          <div className="summary-line">
            <span>Cart Total</span>
            <strong>
              {Number(cart.totalAmount).toLocaleString("sq-AL")} ALL
            </strong>
          </div>

          <div className="summary-line wallet-line">
            <span>Wallet Balance</span>
            <strong>
              {balance === null
                ? "Loading..."
                : `${balance.toLocaleString("sq-AL")} ALL`}
            </strong>
          </div>

          {insufficientBalance && (
            <p className="cart-warning">
              Insufficient wallet balance. You need more money to complete this
              order.
            </p>
          )}

          <div className="summary-total">
            <span>TOTAL TO PAY</span>
            <strong>
              {Number(cart.totalAmount).toLocaleString("sq-AL")} ALL
            </strong>
          </div>

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={
              checkingOut ||
              balance === null ||
              insufficientBalance ||
              cart.items.length === 0
            }
          >
            {checkingOut ? "PLACING ORDER..." : "CONFIRM CHECKOUT"}
          </button>

          <Link to="/" className="continue-shopping-link">
            ← CONTINUE SHOPPING
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
