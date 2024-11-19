import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/login.css"; // Ensure this path is correct
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif"; // Adjust the path as necessary

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = credentials;

    // Clear previous error messages
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed, please try again.");
      }

      const data = await response.json();
      console.log("Response data:", data); // Log the response data

      // Store the username and user ID in localStorage
      localStorage.setItem("username", identifier);
      localStorage.setItem("userId", data.userId); // Store user ID
      localStorage.setItem("sellerStoreName", data.storeName);
      localStorage.setItem("sellerStoreId", data.storeId);

      console.log("User ID stored:", data.userId);
      console.log("Store Name stored:", data.storeName);
      console.log("Store Id stored:", data.storeId);

      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div
        className="background-image-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",

          height: "100vh",
        }}
      ></div>{" "}
      {/* Background Image Container */}
      <nav className="navbar navbar-light bg-white shadow w-100">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="rem logo.png"
              alt="Logo"
              width="60"
              height="70"
              className="d-inline-block align-text-top"
            />
          </a>
          <p className="text-end">
            <a href="#" className="text-decoration-none">
              Need Help?
            </a>
          </p>
        </div>
      </nav>
      <div className="background-text">
        <h1>Login to access your account</h1>
        <h2>PS: not final design</h2>
      </div>
      <div className="login-container shadow">
        <h3 className="login-title">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="identifier" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="identifier"
              placeholder="Enter your username"
              value={credentials.identifier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            LOGIN
          </button>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
        <p className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
