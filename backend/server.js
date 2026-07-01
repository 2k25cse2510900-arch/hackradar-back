const app = require("./src/app");
const connectDB = require("./src/config/db");
const env = require("./src/config/env");
const logger = require("./src/utils/logger");

async function startServer() {
  try {
    await connectDB();

    require("./src/services/telegramBot.service");

    const server = app.listen(env.port, () => {
      logger.info(`HackRadar backend running on port ${env.port}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(
          `Port ${env.port} is already in use. Stop the existing backend process or set PORT to another value.`
        );
      } else {
        logger.error("Backend server error", error);
      }
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
