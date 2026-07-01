const TelegramBot = require("node-telegram-bot-api");

const env = require("../config/env");
const User = require("../models/User");
const logger = require("../utils/logger");

let bot = null;

if (!env.telegramBotToken) {
  logger.warn("Telegram bot token is not configured; bot polling is disabled.");
} else {
  bot = new TelegramBot(env.telegramBotToken, {
    polling: true,
  });

  bot.on("polling_error", (error) => {
    logger.warn("Telegram polling error:", error.response?.body || error.message);
  });

  bot.on("error", (error) => {
    logger.warn("Telegram bot error:", error.message);
  });

  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `
Welcome to HackRadar!

To connect Telegram with your account:

1. Login to HackRadar
2. Click "Connect Telegram"
3. Copy the generated code
4. Send here:

/verify YOUR_CODE
`
    );
  });

  bot.onText(/\/verify (.+)/, async (msg, match) => {
    try {
      const code = match[1].trim();
      const user = await User.findOne({ telegramVerificationCode: code });

      if (!user) {
        await bot.sendMessage(msg.chat.id, "Invalid verification code.");
        return;
      }

      if (!user.telegramVerificationExpires || user.telegramVerificationExpires < new Date()) {
        await bot.sendMessage(msg.chat.id, "Verification code expired.");
        return;
      }

      user.telegramChatId = msg.chat.id.toString();
      user.telegramVerified = true;
      user.telegramVerificationCode = "";
      user.telegramVerificationExpires = null;

      await user.save();
      await bot.sendMessage(msg.chat.id, "Telegram connected successfully with HackRadar!");
    } catch (error) {
      logger.error("Telegram verification failed", error);
      await bot.sendMessage(msg.chat.id, "Verification failed.").catch(() => null);
    }
  });
}

module.exports = bot;
