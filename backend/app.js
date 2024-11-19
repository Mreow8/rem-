const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Example endpoint to get products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ["id", "product_name", "product_image", "created_at"], // Adjust this according to your schema
    });
    // Make sure product_image contains the correct path
    const productsWithPaths = products.map((product) => ({
      ...product,
      product_image: `/uploads/${product.product_image}`, // Prepend the path to the image
    }));
    res.json(productsWithPaths);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
