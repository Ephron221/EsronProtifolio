const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  const mode = process.env.DB_MODE || 'local';
  const dbUri = mode === 'atlas' 
    ? process.env.MONGO_ATLAS_URI 
    : process.env.MONGO_LOCAL_URI;

  if (!dbUri) {
    console.error(`Error: MongoDB URI for mode "${mode}" is not defined.`);
    // Don't process.exit(1) on Vercel
    return;
  }

  try {
    const conn = await mongoose.connect(dbUri);
    isConnected = true;
    console.log(`MongoDB Connected (${mode}): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to ${mode} database: ${error.message}`);
    // Let the error propagate or handle it in the middleware
  }
};

module.exports = connectDB;
