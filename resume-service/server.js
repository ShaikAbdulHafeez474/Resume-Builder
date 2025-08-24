
// src/server.js
require('dotenv').config();

const connectDB  = require('./config/db');
const app = require('./app');
const config  = require('./config/index');

// Connect to MongoDB
connectDB();

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Resume service running on port ${config.port}`);
});



