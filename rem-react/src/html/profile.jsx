import React, { useEffect, useState } from "react";
import Nav from "./nav";
import "../css/profile.css";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContent, setActiveContent] = useState("profile"); // Set profile as active initially

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCartItems(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      console.log(data); // Use this data in the UI
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    alert("Logged out successfully!");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const showContent = (contentId) => {
    setActiveContent(contentId); // Update activeContent state
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Nav
        username={username}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      <header className="App-header"></header>
      <div>
        <div className="other-container">
          <p>{username}</p>
          <p>My Account</p>
          <a
            href="#"
            onClick={() => showContent("profile")}
            className={activeContent === "profile" ? "active" : ""}
          >
            Profile
          </a>
          <a
            href="#"
            onClick={() => showContent("address")}
            className={activeContent === "address" ? "active" : ""}
          >
            Address
          </a>
        </div>
        <div className="profile-container">
          <div id="content">
            {/* Default content is now set to "profile" */}
            {activeContent === "profile" && (
              <>
                <p>Profile Information</p>
                <p>Manage and protect your account</p>
                <p>Username: {username}</p>
                <p>Phone Number</p>
              </>
            )}

            {/* Address content */}
            {activeContent === "address" && (
              <>
                <p>Address Information</p>
                <p>Your saved addresses go here.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
