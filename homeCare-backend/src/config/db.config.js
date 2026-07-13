const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const logger = require("../utils/logger");
const UserModel = require("../models/user.model");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "HomeCare";
let listenersRegistered = false;

async function ensureUserIndexes() {
    const indexes = await UserModel.collection.indexes();
    const legacyMobileIndex = indexes.find((index) => index.name === "mobile_1" && index.unique);

    if (legacyMobileIndex) {
        await UserModel.collection.dropIndex("mobile_1");
        logger.info("[DATABASE] Dropped legacy unique mobile index");
    }

    const sparseMobileRoleIndex = indexes.find(
        (index) => index.name === "mobile_1_role_1" && index.unique && index.sparse && !index.partialFilterExpression
    );
    if (sparseMobileRoleIndex) {
        await UserModel.collection.dropIndex("mobile_1_role_1");
        logger.info("[DATABASE] Replaced mobile index to allow email-only accounts");
    }

    await UserModel.syncIndexes();
}

const connectDB = async() => {
    if (!MONGO_URI) {
        logger.error("[DATABASE] MONGO_URI not found in .env file");
        throw new Error("MONGO_URI not found in .env file");
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
        await ensureUserIndexes();
    } catch (error) {
        logger.error("[DATABASE] Connection Failed", error);
        throw error;
    }
};

module.exports = connectDB;