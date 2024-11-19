// src/components/Checkout.js
import React, { useEffect, useState } from "react";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        console.error("User ID is not found.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${userId}`
        );
        const data = await response.json();
        setCartItems(data);
        // Calculate total amount
        const total = data.reduce(
          (sum, item) => sum + item.product_price * item.quantity,
          0
        );
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleCheckout = () => {
    // Implement your checkout logic here, such as API calls to create an order
    alert("Checkout functionality is not implemented yet.");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product_id}>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  width={100}
                />
                <div>
                  <h2>{item.product_name}</h2>
                  <p>Price: ${item.product_price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Subtotal: ${(item.product_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <h2>Total Amount: ${totalAmount.toFixed(2)}</h2>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
