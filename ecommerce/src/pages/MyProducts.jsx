import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getMyProducts, deleteProduct } from "../api/products";

function MyProducts() {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(location.state?.successMessage || "");

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

  // Restore the previous scroll position when returning from product details
  useEffect(() => {
    if (!loading) {
      const savedPosition = sessionStorage.getItem("myProductsScroll");

      if (savedPosition !== null) {
        const timer = setTimeout(() => {
          window.scrollTo(0, Number(savedPosition));
          sessionStorage.removeItem("myProductsScroll");
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [loading]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const result = await deleteProduct(id);

      if (result === true) {
        setProducts((previousProducts) =>
          previousProducts.filter((product) => product.id !== id),
        );
        setMessage("Product deleted successfully!");
        setError("");
      }
    } catch (err) {
      setError("Could not delete product.");
    }
  };

  if (loading)
    return <p className="status-message">Loading your products...</p>;

  if (error && products.length === 0) {
    return <p className="status-message">{error}</p>;
  }

  return (
    <main className="my-products-page">
      <section className="my-products-heading">
        <div>
          <p className="section-label">CYBERMERCE / SELLER DASHBOARD</p>
          <h1>
            MY <span>INVENTORY</span>
          </h1>
          <p className="inventory-description">
            Manage your products and keep your marketplace updated.
          </p>
        </div>

        <Link to="/my-products/create" className="create-product-button">
          + ADD NEW PRODUCT
        </Link>
      </section>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="inventory-summary">
        <span>YOUR LISTED PRODUCTS</span>
        <strong>{products.length}</strong>
      </div>

      {products.length === 0 ? (
        <div className="inventory-empty">
          <h2>YOUR INVENTORY IS EMPTY</h2>
          <p>You haven't added any products yet.</p>
          <Link to="/my-products/create" className="create-product-button">
            CREATE YOUR FIRST PRODUCT
          </Link>
        </div>
      ) : (
        <div className="my-products-grid">
          {products.map((product) => (
            <article className="my-product-card" key={product.id}>
              <div className="my-product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.productName} />
                ) : (
                  <div className="my-product-no-image">NO IMAGE</div>
                )}

                <span
                  className={
                    product.stock > 0
                      ? "inventory-stock"
                      : "inventory-stock out-of-stock"
                  }
                >
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>

              <div className="my-product-info">
                <h2>{product.productName}</h2>

                <p className="my-product-description">
                  {product.productDescription}
                </p>

                <div className="my-product-details">
                  <span>PRICE</span>
                  <strong>
                    {Number(product.productPrice).toLocaleString("sq-AL")} ALL
                  </strong>
                </div>

                <div className="my-product-details">
                  <span>AVAILABLE STOCK</span>
                  <strong>{product.stock}</strong>
                </div>

                <div className="my-product-actions">
                  <Link
                    to={`/products/${product.id}`}
                    state={{ from: "/my-products" }}
                    onClick={() => {
                      sessionStorage.setItem(
                        "myProductsScroll",
                        String(window.scrollY),
                      );
                    }}
                  >
                    VIEW
                  </Link>
                  <Link to={`/my-products/edit/${product.id}`}>EDIT</Link>
                  <button onClick={() => handleDelete(product.id)}>
                    DELETE
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyProducts;
