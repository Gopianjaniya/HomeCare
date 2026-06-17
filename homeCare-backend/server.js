require("dotenv").config();

const { getLocalIP } = require("./src/utils/common.utils");
const connectDB = require("./src/config/db.config");
const app = require("./src/app");
const logger = require("./src/utils/logger");

const port = process.env.PORT || 8000;

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    logger.info(`[SERVER] Server is running on http://localhost:${port}`);
    logger.info(`[SERVER] Server is running on http://${getLocalIP()}:${port}`);
  });
}

startServer();
