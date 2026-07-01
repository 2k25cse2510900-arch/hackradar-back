require("dotenv").config();

const readEnv = (key, fallback = "") => (process.env[key] || fallback).trim();

const env = {
  nodeEnv: readEnv("NODE_ENV", "development"),
  port: Number(process.env.PORT || 5000),
  mongodbUri: readEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/hackradar"),
  jwtSecret: readEnv("JWT_SECRET", "development-only-secret-change-me"),
  jwtExpiresIn: readEnv("JWT_EXPIRES_IN", "7d"),
  frontendUrl: readEnv("FRONTEND_URL", "http://localhost:3000"),
  googleClientId: readEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: readEnv("GOOGLE_CLIENT_SECRET"),
  googleCallbackUrl:
    readEnv("GOOGLE_CALLBACK_URL", "http://localhost:5000/api/auth/google/callback"),
  emailUser: readEnv("EMAIL_USER"),
  emailPass: readEnv("EMAIL_PASS"),
  telegramBotToken: readEnv("TELEGRAM_BOT_TOKEN"),
};

module.exports = env;
