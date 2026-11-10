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
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <h2>Order: {order.orderNumber}</h2>

            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

            <h3>Products:</h3>

            {order.orderItems.map((item) => (
              <div key={item.id}>
                <h4>{item.product.productName}</h4>
                <p>Price: {item.product.productPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: {item.totalAmount}</p>
              </div>
            ))}

            <h3>Order Total: {order.totalAmount}</h3>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
