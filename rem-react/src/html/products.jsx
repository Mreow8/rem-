import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/products.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Nav from "./nav";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Toggle state for menu
  const navigate = useNavigate();
  const [sellerStoreName, setSellerStoreName] = useState("");

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const storedSellerStoreName = localStorage.getItem("sellerStoreName");
    if (storedSellerStoreName) {
      setSellerStoreName(storedSellerStoreName);
    }

    fetchProducts();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    navigate("/login");
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Filtered products based on search query
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading-message">Loading products...</div>; // Loading state
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="product-list">
      <Nav
        username={username}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        storeName={sellerStoreName}
      />

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const imageUrl = product.product_image || "placeholder_image.png";

            console.log("Image URL:", imageUrl);
            return (
              <Link
                to={`/product_desc/${product.id}`}
                key={product.id}
                className="product-item"
              >
                <img
                  src={imageUrl}
                  alt={product.product_name || "Product Image"}
                  className="product-image"
                />
                <h3 className="product-name">{product.product_name}</h3>
                <p className="product-price">Php {product.product_price}</p>
              </Link>
            );
          })
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
