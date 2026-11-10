import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getProductById, addToCart } from "../api/products";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();

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
      setCartMessage(
        err.response?.data?.message || "Could not add product to cart.",
      );
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <p>Loading product...</p>;

  if (error) return <p>{error}</p>;

  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h1>{product.productName}</h1>

      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.productName} width="200" />
      )}

      <p>{product.productDescription}</p>
      <p>Price: {product.productPrice}</p>
      <p>Stock: {product.stock}</p>
      <p>Seller: {product.username}</p>

      {user && user.id !== product.userId && product.stock > 0 && (
        <div>
          <label>Quantity:</label>

          <input
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
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>

          {cartMessage && <p>{cartMessage}</p>}
        </div>
      )}

      {user && user.id === product.userId && (
        <p>You cannot buy your own product.</p>
      )}

      {product.stock === 0 && <p>Out of stock.</p>}

      {!user && <p>Please log in to add products to your cart.</p>}

      <Link to="/">Back to Products</Link>
    </div>
  );
}

export default ProductDetails;
