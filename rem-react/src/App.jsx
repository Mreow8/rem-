import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./html/Login"; // Adjust the path as necessary
import SignUp from "./html/Signup";
import Home from "./html/home";
import Add_to_Cart from "./html/add_to_cart";
import Product from "./html/products";
import Product_desc from "./html/product_desc";
import Buy_now from "./html/buy-now";
import Profile from "./html/profile";
import Store from "./html/store";
import Seller from "./html/seller";

import SellerAddProduct from "./html/sellerAddProduct";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<Product />} />
        <Route path="/add_to_cart" element={<Add_to_Cart />} />
        <Route path="/product_desc/:id" element={<Product_desc />} />
        <Route path="/sellerAddProduct" element={<SellerAddProduct />} />
        <Route path="/buy_now" element={<Buy_now />} />
        <Route path="/store/:id" element={<Store />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
