import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import Nav from "./nav";
import "../css/store.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const Store = () => {
  const { id } = useParams(); // Retrieve the store ID from the URL
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null); // To hold seller information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products?storeId=${id}`
        ); // Fetch products for the specific store
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();

        if (data.length > 0) {
          setSeller({
            name: data[0].store_name,
            image: data[0].seller_image || "placeholder_seller_image.png", // Add default image if missing
            region: data[0].region, // Set region
            province: data[0].province, // Set province
          });
        }

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  const handleDelete = async (productId) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete the product.");
        }
        // Remove deleted product from state
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (loading) {
    return <div className="loading-message">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="store-container">
      <Nav /> {/* Include navigation */}
      <Link to="/sellerAddProduct">
        <button className="btn-product">Add Product</button>
      </Link>
      {seller && (
        <div className="seller-info">
          <img
            src={`http://localhost:5000/uploads/${seller.image}`}
            alt={seller.name}
            className="seller-image"
          />
          <h2 className="seller-name">{seller.name}</h2>
          <p>
            {seller.region}, {seller.province}
          </p>
        </div>
      )}
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => {
            const imageUrl = product.product_image || "placeholder_image.png";

            return (
              <div key={product.id} className="product-item">
                <Link
                  to={`/product_desc/${product.id}`}
                  className="product-item-link"
                >
                  <img
                    src={imageUrl}
                    alt={product.product_name || "Product Image"}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-price">Php {product.product_price}</p>
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  <i className="bi bi-trash"></i> {/* Bootstrap trash icon */}
                </button>
              </div>
            );
          })
        ) : (
          <p>No products available for this store.</p>
        )}
      </div>
    </div>
  );
};

export default Store;
