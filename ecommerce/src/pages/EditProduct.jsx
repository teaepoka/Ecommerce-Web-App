import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductById, updateProduct } from "../api/products";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        setProductName(data.productName);
        setProductDescription(data.productDescription);
        setProductPrice(data.productPrice);
        setStock(data.stock);
        setImageUrl(data.imageUrl || "");
      } catch (err) {
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      await updateProduct({
        id: Number(id),
        productName,
        productDescription,
        productPrice: Number(productPrice),
        stock: Number(stock),
        imageUrl,
      });

      navigate("/my-products", {
        state: {
          successMessage: "Product updated successfully!",
        },
      });
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);

      const errorData = err.response?.data;

      setError(
        typeof errorData === "string"
          ? errorData
          : errorData?.message ||
              errorData?.title ||
              "Could not update product.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="status-message">Loading product...</p>;
  }

  return (
    <main className="product-form-page">
      <section className="product-form-header">
        <p className="section-label">CYBERMERCE / SELLER TERMINAL</p>
        <h1>
          EDIT <span>PRODUCT</span>
        </h1>
        <p>Update your product information and inventory.</p>
      </section>

      <section className="product-form-card">
        <div className="form-card-heading">
          <span className="form-status-dot"></span>
          <h2>PRODUCT MODIFICATION</h2>
          <span className="form-required">* REQUIRED FIELDS</span>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-field">
            <label htmlFor="productName">PRODUCT NAME *</label>
            <input
              id="productName"
              type="text"
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
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <small>Optional — update your product image link</small>
          </div>

          {error && <p className="product-form-error">{error}</p>}

          <div className="product-form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "SAVING CHANGES..." : "SAVE CHANGES"}
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

export default EditProduct;
