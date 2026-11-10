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

  // Load the existing product information
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

  // Save the updated product
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

      navigate("/my-products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div>
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            minLength={5}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            maxLength={1000}
            required
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label>Image URL (optional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
