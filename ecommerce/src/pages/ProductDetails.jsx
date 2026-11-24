import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router";
import { getProductById, addToCart } from "../api/products";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();

  const backTo = location.state?.from || "/";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setCartMessage("");
    setCartLoading(true);

    try {
      await addToCart(product.id, Number(quantity));
      setCartMessage("Product added to cart!");
    } catch (err) {
      const errorData = err.response?.data;

      const errorMessage =
        typeof errorData === "string"
          ? errorData
          : errorData?.message ||
            errorData?.title ||
            "Could not add product to cart.";

      setCartMessage(errorMessage);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <p className="status-message">Loading product...</p>;
  if (error) return <p className="status-message">{error}</p>;
  if (!product) return <p className="status-message">Product not found.</p>;

  return (
    <main className="product-details-page">
      <Link to={backTo} className="back-link">
        ← BACK TO {backTo === "/my-products" ? "MY PRODUCTS" : "PRODUCTS"}
      </Link>

      <section className="product-details-card">
        <div className="details-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.productName} />
          ) : (
            <div className="details-no-image">NO IMAGE AVAILABLE</div>
          )}
        </div>

        <div className="details-info">
          <p className="details-label">CYBERMERCE / PRODUCT DETAILS</p>

          <h1>{product.productName}</h1>

          <p className="details-price">
            {Number(product.productPrice).toLocaleString("sq-AL")} ALL
          </p>

          <div className="details-divider"></div>

          <h3>DESCRIPTION</h3>
          <p className="details-description">{product.productDescription}</p>

          <div className="details-meta">
            <p>
              <span>STOCK</span>
              <strong>{product.stock}</strong>
            </p>

            <p>
              <span>SELLER</span>
              <strong>{product.username}</strong>
            </p>
          </div>

          {user && user.id !== product.userId && product.stock > 0 && (
            <div className="purchase-section">
              <label htmlFor="quantity">QUANTITY</label>

              <input
                id="quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button
                onClick={handleAddToCart}
                disabled={
                  cartLoading ||
                  Number(quantity) < 1 ||
                  Number(quantity) > product.stock
                }
              >
                {cartLoading ? "ADDING..." : "ADD TO CART"}
              </button>

              {cartMessage && <p className="cart-message">{cartMessage}</p>}
            </div>
          )}

          {user && user.id === product.userId && (
            <p className="details-notice">You cannot buy your own product.</p>
          )}

          {product.stock === 0 && (
            <p className="details-notice out-of-stock-message">OUT OF STOCK</p>
          )}

          {!user && (
            <p className="details-notice">
              Please <Link to="/login">log in</Link> to add products to your
              cart.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;
