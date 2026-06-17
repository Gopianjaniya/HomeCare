const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    logger.error("[DATABASE] not found in .env file");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    mongoose.connection.on("connected", () => {
      logger.info("[DATABASE] Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("[DATABASE] connection error");
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("[DATABASE] disconnected. Retrying...");
    });

    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME,
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error("[DATABASE] Connection Failed:");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;


