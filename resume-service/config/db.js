// src/config/db.js
const mongoose = require('mongoose');
const config = require('./index');

const MAX_RETRIES = 5;
let retries = 0;

const connectDB = async () => {
  const connect = async () => {
    try {
      await mongoose.connect(config.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`✅ MongoDB connected: ${config.mongoUri}`);
    } catch (err) {
      console.error(`❌ MongoDB connection error (attempt ${retries + 1}):`, err.message);
      retries += 1;
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Retrying MongoDB connection in 5s...`);
        setTimeout(connect, 5000);
      } else {
        console.error(`🚨 Max retries reached. Exiting...`);
        process.exit(1);
      }
    }
  };

  // 👇 event listeners
  mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB event: connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('⚠️ MongoDB event: error', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('🔌 MongoDB event: disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('♻️ MongoDB event: reconnected');
  });

  // 👇 initial connect
  await connect();
};

module.exports = connectDB;
