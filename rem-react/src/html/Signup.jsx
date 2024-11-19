import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/login.css"; // Adjust the path as necessary
import { Link } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif"; // Adjust the path as necessary

const SignUp = () => {
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const phone = event.target.phoneInput.value;
    const email = event.target.emailInput.value;
    const password = event.target.passwordInput.value;
    const username = event.target.usernameInput.value; // Get the username input value

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, email, password, username }), // Include username in the request
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error response:", errorData); // Debugging line
        alert(errorData.message);
        return; // Stop execution if there's an error
      }

      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      console.error("Error signing up:", error); // Debugging line
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
      <nav className="navbar navbar-light bg-white shadow w-100">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="rem logo.png" // Ensure the path is correct
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
        <h1>Create an account to start buying and selling educational books</h1>
      </div>
      <div className="login-container shadow">
        <h3 className="login-title">Sign Up</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="usernameInput" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="usernameInput"
              name="usernameInput" // Add name attribute
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phoneInput" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              className="form-control"
              id="phoneInput"
              name="phoneInput" // Add name attribute
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="emailInput" // Add name attribute
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              name="passwordInput" // Add name attribute
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            SIGN UP
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
