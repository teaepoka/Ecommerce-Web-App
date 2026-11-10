import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getMyProducts, deleteProduct } from "../api/products";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const data = await getMyProducts();
        setProducts(data);
      } catch (err) {
        setError("Could not load your products.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  if (loading) return <p>Loading your products...</p>;

  if (error) return <p>{error}</p>;

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const result = await deleteProduct(id);

      if (result === true) {
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (err) {
      setError("Could not delete product.");
    }
  };

  return (
    <div>
      <h1>My Products</h1>

      <Link to="/my-products/create">Add New Product</Link>

      {products.length === 0 ? (
        <p>You haven't added any products yet.</p>
      ) : (
        products.map((product) => (
          <div key={product.id}>
            <h2>{product.productName}</h2>

            <p>{product.productDescription}</p>
            <p>Price: {product.productPrice}</p>
            <p>Stock: {product.stock}</p>

            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.productName}
                width="150"
              />
            )}

            <Link to={`/products/${product.id}`}>View Product</Link>

            <Link to={`/my-products/edit/${product.id}`}>Edit Product</Link>
            <button onClick={() => handleDelete(product.id)}>
              Delete Product
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyProducts;
