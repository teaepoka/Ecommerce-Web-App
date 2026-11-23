import { useState } from "react";
import { useNavigate } from "react-router";
import { createProduct } from "../api/products";

function CreateProduct() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await createProduct({
        productName,
        productDescription,
        productPrice: Number(productPrice),
        stock: Number(stock),
        imageUrl,
      });

      if (data.id) {
        navigate("/my-products");
      } else {
        setError("Could not create product.");
      }
    } catch (err) {
      console.log("CREATE PRODUCT ERROR:", err.response?.data || err.message);

      const errorData = err.response?.data;

      setError(
        typeof errorData === "string"
          ? errorData
          : errorData?.message || errorData?.title || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="product-form-page">
      <section className="product-form-header">
        <p className="section-label">CYBERMERCE / SELLER TERMINAL</p>
        <h1>
          ADD NEW <span>PRODUCT</span>
        </h1>
        <p>Expand your inventory. Bring something new to the marketplace.</p>
      </section>

      <section className="product-form-card">
        <div className="form-card-heading">
          <span className="form-status-dot"></span>
          <h2>PRODUCT REGISTRATION</h2>
          <span className="form-required">* REQUIRED FIELDS</span>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-field">
            <label htmlFor="productName">PRODUCT NAME *</label>
            <input
              id="productName"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              minLength={5}
              maxLength={100}
              required
            />
            <small>5–100 characters</small>
          </div>

          <div className="form-field">
            <label htmlFor="productDescription">DESCRIPTION *</label>
            <textarea
              id="productDescription"
              placeholder="Describe your product..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              maxLength={1000}
              required
            />
            <small>Maximum 1000 characters</small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="productPrice">PRICE (ALL) *</label>
              <input
                id="productPrice"
                type="number"
                placeholder="0.00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="stock">AVAILABLE STOCK *</label>
              <input
                id="stock"
                type="number"
                placeholder="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="imageUrl">IMAGE URL</label>
            <input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <small>Optional — add a link to your product image</small>
          </div>

          {error && <p className="product-form-error">{error}</p>}

          <div className="product-form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "CREATING PRODUCT..." : "CREATE PRODUCT"}
            </button>

            <button
              type="button"
              className="cancel-form-button"
              onClick={() => navigate("/my-products")}
            >
              CANCEL
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateProduct;
