// server.js
const mongoose = require("mongoose");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5005;

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Template service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database", err);
    process.exit(1);
  });
