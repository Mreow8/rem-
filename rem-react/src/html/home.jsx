import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css"; // Ensure your CSS file is correctly linked

const Home = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow w-100">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="rem logo.png" // Ensure the path to the logo is correct
              alt="Resource Exchange Marketplace Logo"
              width="60"
              height="70"
              className="d-inline-block align-text-top"
            />
          </Link>
          <p className="text-end mb-0">
            <Link to="/help" className="text-decoration-none">
              Need Help?
            </Link>
          </p>
        </div>
      </nav>

      {/* Background Image below navbar */}
      <div className="background-image-content">
        <h1>Welcome to Resource Exchange Marketplace</h1>
        <p>Find and share secondhand books</p>
        <Link to="/products">
          <button className="btn btn-primary">
            <p>Shop Now</p>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
