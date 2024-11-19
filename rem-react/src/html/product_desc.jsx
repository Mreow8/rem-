import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import "../css/product_desc.css";

const ProductDesc = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch product details for ID: ${id}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const handleBuyNow = () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
      return;
    }
  };
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!product) return;

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: storedUserId,
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error adding item to cart: " + error.message);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!product) {
    return <div className="no-product-message">No product found.</div>;
  }

  return (
    <div className="product-desc-container">
      <Nav username={username} />
      <div className="container my-6">
        <div className="row">
          <div className="col-md-8">
            <div className="card product-card p-3">
              <div className="row">
                <div className="col-12 col-md-4">
                  <img
                    src={product.product_image || "placeholder_image.png"}
                    alt={product.product_name}
                    className="img-fluid"
                  />
                </div>
                <div className="col-12 col-md-8">
                  <h2>{product.product_name}</h2>
                  <p className="text-danger h4">Php {product.product_price}</p>
                  <p>Quantity</p>
                  <div
                    className="input-group mb-3"
                    style={{ maxWidth: "140px" }}
                  >
                    <button
                      className="btn btn-outline-secondary"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>
                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-primary" onClick={handleBuyNow}>
                      Buy Now
                    </button>
                    <button className="btn btn-dark" onClick={handleAddToCart}>
                      Add to Cart
                    </button>
                  </div>
                  <Link
                    to="/products"
                    className="back-to-products d-block mt-3"
                  >
                    Back to Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3">
              <h6>Product Description</h6>
              <p>{product.product_description}</p>
            </div>
          </div>
          <div className="col-12 text-center mt-3">
            <img
              src={product.seller_image || "placeholder_image.png"}
              className="img-fluid seller-image mb-2"
            />
            <p>{product.store_name}</p>
            <p>{product.province}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDesc;
