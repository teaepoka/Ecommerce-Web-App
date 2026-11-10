import { useEffect, useState } from "react";
import { getAllProducts, getActiveProducts } from "../api/products";
import { Link } from "react-router";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await getActiveProducts({
        searchTerm,
        minPrice: minPrice === "" ? 0 : Number(minPrice),
        maxPrice: maxPrice === "" ? 0 : Number(maxPrice),
      });

      setProducts(data);
    } catch (err) {
      setError("Could not filter products.");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>All Products</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="number"
          placeholder="Minimum price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Maximum price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </form>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading &&
        products.map((product) => (
          <div key={product.id}>
            <h2>
              <Link to={`/products/${product.id}`}>{product.productName}</Link>
            </h2>
            <p>{product.productDescription}</p>
            <p>Price: {product.productPrice}</p>
            <p>Stock: {product.stock}</p>
            <p>Seller: {product.username}</p>

            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.productName}
                width="150"
              />
            )}
          </div>
        ))}
    </div>
  );
}

export default ProductList;
