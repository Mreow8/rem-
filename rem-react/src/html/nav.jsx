import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import remLogo from "../assets/rem_logo.png";

const Nav = ({ handleLogout, searchQuery, handleSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [sellerStoreName, setSellerStoreName] = useState(null);
  const [sellerStoreId, setSellerStoreId] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setSellerStoreName(localStorage.getItem("sellerStoreName"));
    setSellerStoreId(localStorage.getItem("sellerStoreId"));

    console.log("Retrieved Username:", localStorage.getItem("username"));
    console.log(
      "Retrieved Seller Store Name:",
      localStorage.getItem("sellerStoreName")
    );
    console.log(
      "Retrieved Seller Store ID:",
      localStorage.getItem("sellerStoreId")
    );
  }, []);
  handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("sellerStoreName");
    localStorage.removeItem("sellerStoreId");
    setUsername(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginClick = () => {
    // Prevent navigation if the user is logged in
    if (!username) {
      navigate("/login"); // Navigate to login if not logged in
    }
  };

  const renderSellerSection = () => {
    if (
      sellerStoreId &&
      sellerStoreId !== "null" &&
      sellerStoreName &&
      sellerStoreName !== "null"
    ) {
      return (
        <Link to={`/store/${sellerStoreId}`} id="store_link">
          <p>{sellerStoreName}</p>
        </Link>
      );
    } else {
      return (
        <Link to="/seller">
          <p>Start Selling</p>
        </Link>
      );
    }
  };

  return (
    <nav className="navbar navbar-light bg-white shadow w-100">
      <div className="container-fluid">
        <Link to="/products">
          <img
            src={remLogo}
            alt="Logo"
            width="60"
            height="70"
            className="d-inline-block align-text-top"
          />
        </Link>

        <div className="auth-cart-container text-end">
          {username ? (
            <div className="user-logout-container">
              <button onClick={toggleMenu} className="mb-0" id="btn_username">
                Welcome, {username}!
              </button>

              {isMenuOpen && (
                <div id="menu">
                  <Link to="/profile">
                    <p>My Profile</p>
                  </Link>
                  {renderSellerSection()}
                  <button onClick={handleLogout} className="btn btn-sm ms-3">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="mb-0">
              <span
                className="text-dark cursor-pointer"
                onClick={handleLoginClick}
              >
                Login
              </span>
              <span className="mx-2">|</span>
              <Link to="/signup" className="text-decoration-none text-dark">
                Signup
              </Link>
            </p>
          )}

          <div className="search-cart-container d-flex align-items-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ fontSize: "25px", marginLeft: "10px" }}
                aria-hidden="true"
              />
            </div>
            <Link to="/add_to_cart" aria-label="View Cart">
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{ fontSize: "25px", marginLeft: "10px" }}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
