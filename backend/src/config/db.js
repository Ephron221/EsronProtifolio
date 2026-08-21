const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  const mode = process.env.DB_MODE || (process.env.MONGO_URI ? 'custom' : 'local');
  const dbUri = process.env.MONGO_URI || (mode === 'atlas' 
    ? process.env.MONGO_ATLAS_URI 
    : process.env.MONGO_LOCAL_URI);

  if (!dbUri) {
    console.error(`[DB Error]: MongoDB URI is not defined in environment variables.`);
    return;
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnecting = false;
    console.log(`[Database]: MongoDB Connected successfully (${conn.connection.host})`);
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[Database Error]: Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
