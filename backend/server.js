const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql2");
const productRoutes = require("./routes/products1");
// Create an instance of express
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/seller_images",
  express.static(path.join(__dirname, "seller_images"))
);

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "resource_exchange_marketplace",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return; // Exit if connection fails
  }
  console.log("Connected to the MySQL database");
});

app.use("/api/seller-products", productRoutes);

//get the products from the database
app.get("/api/products", (req, res) => {
  const storeId = req.query.storeId; // Get storeId from query parameter, if it exists

  let query = `
    SELECT products.*, sellers.store_name ,sellers.image AS seller_image,sellers.region,sellers.province
    FROM products 
    INNER JOIN sellers ON products.seller_id = sellers.seller_id
  `;

  const queryParams = [];

  // If storeId is provided, add WHERE clause to filter by store
  if (storeId) {
    query += " WHERE sellers.seller_id = ?";
    queryParams.push(storeId);
  }

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error("Error retrieving products from the database:", error);
      return res.status(500).json({ message: "Error retrieving products." });
    }

    const productsWithPaths = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:${PORT}/uploads/${product.product_image}`
        : null,
    }));

    res.status(200).json(productsWithPaths);
  });
});

// app.get("/api/products", (req, res) => {
//   const query =
//     " SELECT products.*, sellers.seller_id FROM products INNER JOIN sellers ON products.seller_id = sellers.seller_id";

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error retrieving products from database:", error);
//       return res.status(500).json({ message: "Error retrieving products" });
//     }

//     const productsWithPaths = results.map((product) => ({
//       ...product,
//       product_image: product.product_image
//         ? `http://localhost:${PORT}/uploads/${product.product_image}`
//         : null,
//     }));
//     productsWithPaths.forEach((product) => {
//       console.log(
//         `Product ID: ${product.id}, Image URL: ${product.product_image}`
//       );
//     });

//     res.status(200).json(productsWithPaths);
//   });
// });
// DELETE route to remove a product by ID
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM products WHERE id = ?"; // Adjust the table name if necessary

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Error deleting product" });
    }

    // Check if any row was affected
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  });
});

//get the products by id
// Route to fetch product by ID from the database
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  const query =
    "SELECT products.*, sellers.store_name, sellers.province, sellers.image AS seller_image  FROM products inner join sellers on sellers.seller_id= products.seller_id WHERE id = ?";

  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error retrieving product:", error);
      return res.status(500).json({ message: "Error retrieving product" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `Product not found for ID: ${productId}` });
    }

    const product = {
      ...results[0],
      product_image: results[0].product_image
        ? `http://localhost:${PORT}/uploads/${results[0].product_image}`
        : null,
      seller_image: results[0].seller_image
        ? `http://localhost:${PORT}/seller_images/${results[0].seller_image}`
        : null,
    };

    res.json(product);
  });
});
app.post("/api/signup", (req, res) => {
  const { phone, email, password, username } = req.body;

  // Basic validation
  if (!phone || !email || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if the user already exists
  const checkUserQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkUserQuery, [username], (error, results) => {
    if (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // Insert the new user into the database without hashing the password
    const insertUserQuery =
      "INSERT INTO users (phone, email, password, username) VALUES (?, ?, ?, ?)";
    db.query(
      insertUserQuery,
      [phone, email, password, username],
      (error, results) => {
        if (error) {
          console.error("Error inserting user:", error);
          return res.status(500).json({ message: "Error signing up." });
        }

        // Respond with success message
        res.status(201).json({ message: "User created successfully!" });
      }
    );
  });
});

// Route to handle login
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const query = `
  SELECT users.user_id, users.username, sellers.store_name, sellers.seller_id
  FROM users
  LEFT JOIN sellers ON users.user_id = sellers.user_id
  WHERE users.username = ? AND users.password = ?
`;

  db.query(query, [identifier, password], (error, results) => {
    if (error) {
      console.error("Error during login query:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];

      return res.status(200).json({
        message: "Login successful!",
        userId: user.user_id,
        username: user.username,
        storeName: user.store_name,
        storeId: user.seller_id,
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.post("/api/cart", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required." });
  }

  const query =
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";

  db.query(
    query,
    [user_id, product_id, quantity, quantity],
    (error, results) => {
      if (error) {
        console.error("Error adding item to cart:", error);
        return res.status(500).json({ message: "Error adding item to cart" });
      }

      res.status(200).json({ message: "Item added to cart successfully!" });
    }
  );
});

// Route to handle signup

// Route to get cart items with product details
app.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
    
  products.product_name,
  products.product_price,
  products.product_image,

  cart.quantity,
  sellers.store_name AS seller_username,
  cart.product_id

FROM 
  cart
JOIN 
  products ON cart.product_id = products.id
JOIN 
  sellers ON products.seller_id = sellers.seller_id
WHERE 
  cart.user_id = ?`;
  console.log("SQL Query:", query, "with userId:", userId);

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving cart items:", error);
      return res.status(500).json({ message: "Error retrieving cart items" });
    }
    const productsWithImages = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:5000/uploads/${product.product_image}` // Update to your server URL
        : "placeholder_image.png", // Provide a default placeholder image
    }));

    res.status(200).json(productsWithImages);
  });
});

// Route to update item quantity in the cart
app.put("/api/carts", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required." });
  }

  const query = `
    UPDATE cart 
    SET quantity = ? 
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(query, [quantity, user_id, product_id], (error, results) => {
    if (error) {
      console.error("Error updating item quantity:", error);
      return res.status(500).json({ message: "Error updating item quantity" });
    }

    res.status(200).json({ message: "Item quantity updated successfully!" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Required imports

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "seller_images")); // Folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to handle seller details submission
app.post("/api/sellers", upload.single("store_image"), (req, res) => {
  const {
    user_id,
    store_name,
    phone,
    email,
    region,
    province,
    city,
    barangay,
    postal_code,
  } = req.body;
  const storeImage = req.file ? req.file.filename : null; // Get the uploaded image file name
  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  console.log("Inserting seller data:", {
    user_id,
    store_name,
    phone,
    email,
    region,
    province,
    city,
    barangay,
    postal_code,
    storeImage,
  });
  // SQL query to insert seller details into the database
  const query = `
    INSERT INTO sellers (user_id,store_name, phone, email, region, province, city, barangay, postal_code, image)
    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      user_id,
      store_name,
      phone,
      email,
      region,

      province,
      city,
      barangay,
      postal_code,
      storeImage,
    ],
    (error, results) => {
      if (error) {
        console.error("Error saving seller data:", error);
        return res.status(500).json({ message: "Error saving seller data" });
      }

      res.status(201).json({ message: "Seller added successfully!" });
    }
  );
});
