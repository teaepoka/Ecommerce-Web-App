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
  const [failedImages, setFailedImages] = useState({});
  const [heroIndex, setHeroIndex] = useState(0);

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
      setHeroIndex(0);
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
    setHeroIndex(0);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const heroImages = products.filter(
    (product) => product.imageUrl && !failedImages[product.id],
  );

  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setHeroIndex((currentIndex) => {
        let nextIndex;

        do {
          nextIndex = Math.floor(Math.random() * heroImages.length);
        } while (nextIndex === currentIndex % heroImages.length);

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const activeHeroIndex =
    heroImages.length > 0 ? heroIndex % heroImages.length : 0;

  const activeHeroProduct = heroImages[activeHeroIndex];

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <main className="products-page">
      {/* Homepage hero */}
      <section className="hero-section" onMouseMove={handleHeroMouseMove}>
        <div className="hero-content">
          <p className="hero-label">DISCOVER SOMETHING DIFFERENT</p>

          <h1>
            TECH THAT
            <br />
            MOVES <span>YOU.</span>
          </h1>

          <p className="hero-description">
            Explore unique products, discover new sellers and find something
            worth making yours.
          </p>

          <a href="#catalog" className="hero-button">
            EXPLORE PRODUCTS <span>→</span>
          </a>

          <div className="hero-meta">
            <span>YOUR MARKETPLACE</span>
            <span>BUILT FOR DISCOVERY</span>
          </div>
        </div>

        {/* Product slideshow */}
        <div className="hero-visual">
          {activeHeroProduct ? (
            <div className="hero-slideshow">
              <Link
                to={`/products/${activeHeroProduct.id}`}
                state={{ from: "/", restoreScroll: window.scrollY }}
                className="hero-slide"
                key={activeHeroProduct.id}
              >
                <img
                  src={activeHeroProduct.imageUrl}
                  alt={activeHeroProduct.productName}
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [activeHeroProduct.id]: true,
                    }))
                  }
                />

                <div className="hero-slide-info">
                  <span>FEATURED PRODUCT</span>
                  <h2>{activeHeroProduct.productName}</h2>
                  <p>
                    {Number(activeHeroProduct.productPrice).toLocaleString(
                      "sq-AL",
                    )}{" "}
                    ALL
                  </p>
                  <span className="hero-slide-link">DISCOVER ITEM →</span>
                </div>
              </Link>

              <div className="hero-slide-dots">
                {heroImages.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    className={index === activeHeroIndex ? "active" : ""}
                    onClick={() => setHeroIndex(index)}
                    aria-label={`Show ${product.productName}`}
                    aria-current={
                      index === activeHeroIndex ? "true" : undefined
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="hero-collage-empty">
              {loading ? "PRODUCTS LOADING..." : "NO PRODUCTS AVAILABLE"}
            </div>
          )}
        </div>
      </section>

      {/* Product section */}
      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE THE MARKETPLACE</p>
            <h2>
              ALL PRODUCTS<span>_</span>
            </h2>
          </div>
        </div>

        {/* Search and filters */}
        <form className="filter-panel" onSubmit={handleSearch}>
          <div className="search-field">
            <label htmlFor="product-search">Search products</label>
            <input
              id="product-search"
              type="text"
              placeholder="Enter product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="price-field">
            <label htmlFor="min-price">Minimum price</label>
            <input
              id="min-price"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="price-field">
            <label htmlFor="max-price">Maximum price</label>
            <input
              id="max-price"
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button type="submit">SEARCH</button>
            <button
              type="button"
              className="clear-button"
              onClick={clearFilters}
            >
              CLEAR
            </button>
          </div>
        </form>

        {/* Loading and error messages */}
        {loading && <p className="status-message">SCANNING MARKETPLACE...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <div className="empty-products">
            <h3>NO PRODUCTS FOUND</h3>
            <p>Try another search or clear your filters.</p>
          </div>
        )}

        {/* Product cards */}
        {!loading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  {product.imageUrl && !failedImages[product.id] ? (
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      onError={() =>
                        setFailedImages((prev) => ({
                          ...prev,
                          [product.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <div className="no-image">
                      <span>NO IMAGE</span>
                    </div>
                  )}

                  <span
                    className={
                      product.stock > 0
                        ? "stock-label"
                        : "stock-label out-of-stock"
                    }
                  >
                    {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{product.productName}</h3>

                  <p className="product-description">
                    {product.productDescription}
                  </p>

                  <p className="product-seller">SELLER: {product.username}</p>

                  <div className="product-bottom">
                    <span className="product-price">
                      {Number(product.productPrice).toLocaleString("sq-AL")} ALL
                    </span>

                    <Link
                      className="view-product"
                      to={`/products/${product.id}`}
                      state={{ from: "/", restoreScroll: window.scrollY }}
                    >
                      VIEW ITEM →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductList;
