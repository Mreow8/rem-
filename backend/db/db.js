// db.js
const mysql = require("mysql2");

// Create a connection to the database
const db = mysql.createConnection({
  host: "localhost", // Database host
  user: "root",
  password: "",
  database: "resource_exchange_marketplace", // Replace with your actual database name
});

// Connect to the databasehttp://localhost/phpmyadmin/index.php?route=/database/structure&db=1resource_exchange_marketplace
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = db;
