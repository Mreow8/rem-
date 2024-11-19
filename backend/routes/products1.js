// routes/products.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/db"); // Ensure you have the correct path for your db connection

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// POST request to save a new product
router.post("/", upload.single("product_image"), (req, res) => {
  console.log("Frontend has approached the backend to add a new product.");

  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const {
    product_name,
    product_price,
    product_quantity,
    product_author,
    product_description,
    product_category,
  } = req.body;

  const storeId = req.body.store_id;

  if (!req.file) {
    return res.status(400).json({ message: "Product image is required" });
  }

  if (!product_name || !product_price || !product_quantity) {
    return res
      .status(400)
      .json({ message: "Product name, price, and quantity are required" });
  }

  const productImage = req.file.filename;

  // Insert the product into the database
  const sql = `
    INSERT INTO products 
    (seller_id, product_image, product_name, product_price, product_quantity, product_author, product_description, created_at, updated_at, category) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
  `;

  db.query(
    sql,
    [
      storeId,
      productImage,
      product_name,
      product_price,
      product_quantity,
      product_author,
      product_description,
      product_category,
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving product:", err);
        return res
          .status(500)
          .json({ message: "Error saving product", error: err.message });
      }

      res.status(201).json({ message: "Product added successfully!" });
    }
  );
});

// Route to get all products
router.get("/", (req, res) => {
  const query = "SELECT * FROM products";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error retrieving products from database:", error);
      return res.status(500).json({ message: "Error retrieving products" });
    }

    const productsWithPaths = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:${process.env.PORT}/uploads/${product.product_image}`
        : null,
    }));

    res.status(200).json(productsWithPaths);
  });
});

// Route to fetch product by ID from the database
router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  const query =
    "SELECT products.*, sellers.store_name FROM products INNER JOIN sellers ON sellers.seller_id = products.seller_id WHERE products.id = ?";

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

    const product = results[0];
    product.product_image = product.product_image
      ? `http://localhost:${process.env.PORT}/uploads/${product.product_image}`
      : null;

    res.json(product);
  });
});

module.exports = router;
