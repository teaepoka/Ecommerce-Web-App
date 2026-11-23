import { useEffect, useState } from "react";
import { getMyOrders } from "../api/products";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(
          [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-status">
        <p>LOADING YOUR ORDERS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-status orders-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-heading">
        <p className="orders-label">TRANSACTION HISTORY</p>
        <h1>
          MY <span>ORDERS</span>
        </h1>
        <p className="orders-subtitle">Your purchases, all in one place.</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">⌁</div>
          <h2>NO ORDERS FOUND</h2>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <details className="order-card" key={order.id}>
              <summary className="order-card-summary">
                <div className="order-summary-main">
                  <div>
                    <p className="order-label">ORDER NUMBER</p>
                    <h2>#{order.orderNumber}</h2>
                  </div>

                  <div className="order-date">
                    <p className="order-label">DATE</p>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="order-item-count">
                    <p className="order-label">ITEMS</p>
                    <span>{order.orderItems.length}</span>
                  </div>
                </div>

                <div className="order-summary-total">
                  <strong>
                    {Number(order.totalAmount).toLocaleString("sq-AL")} ALL
                  </strong>
                  <span className="order-expand">VIEW DETAILS +</span>
                </div>
              </summary>

              <div className="order-details">
                <p className="order-section-title">PURCHASED ITEMS</p>

                {order.orderItems.map((item) => (
                  <div className="order-product" key={item.id}>
                    <div className="order-product-info">
                      <h3>{item.product.productName}</h3>
                      <p>
                        {Number(item.product.productPrice).toLocaleString(
                          "sq-AL",
                        )}{" "}
                        ALL × {item.quantity}
                      </p>
                    </div>

                    <span className="order-item-total">
                      {Number(item.totalAmount).toLocaleString("sq-AL")} ALL
                    </span>
                  </div>
                ))}

                <div className="order-total">
                  <span>ORDER TOTAL</span>
                  <strong>
                    {Number(order.totalAmount).toLocaleString("sq-AL")} ALL
                  </strong>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
