const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "HomeCare";
let listenersRegistered = false;

const connectDB = async () => {
  if (!MONGO_URI) {
    logger.error("[DATABASE] MONGO_URI not found in .env file");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    if (!listenersRegistered) {
      mongoose.connection.on("connected", () => {
        logger.info("[DATABASE] Connected Successfully", { database: DB_NAME });
      });

      mongoose.connection.on("error", (err) => {
        logger.error("[DATABASE] connection error", err);
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("[DATABASE] disconnected. Retrying...");
      });

      listenersRegistered = true;
    }

    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    logger.error("[DATABASE] Connection Failed", error);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;


