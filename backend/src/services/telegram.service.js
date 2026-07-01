const axios = require("axios");
const env = require("../config/env");

const sendTelegramMessage = async (chatId, message) => {
  try {
    const token = env.telegramBotToken;
    if (!token) return null;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await axios.post(url, {
  chat_id: chatId,
  text: message,
  parse_mode: "Markdown",
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🌐 Open HackRadar",
          url: "https://yourwebsite.com"
        }
      ]
    ]
  }
});

    return response.data;
  } catch (error) {
    console.error(
      "Telegram Error:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  sendTelegramMessage,
};
const axios = require("axios");
const env = require("../config/env");

const BOT_URL = `https://api.telegram.org/bot${env.telegramBotToken}`;

async function sendTelegramMessage(chatId, message) {
  if (!env.telegramBotToken) {
    console.warn("Telegram Bot Token missing");
    return false;
  }

  if (!chatId) {
    console.warn("Telegram Chat ID missing");
    return false;
  }

  try {
    await axios.post(
      `${BOT_URL}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Open HackRadar",
                url:
                  env.frontendUrl ||
                  "http://localhost:3000",
              },
            ],
          ],
        },
      },
      {
        timeout: 10000,
      }
    );

    console.log(`Telegram sent -> ${chatId}`);

    return true;
  } catch (error) {
    console.error(
      "Telegram Error:",
      error.response?.data || error.message
    );

    return false;
  }
}

module.exports = {
  sendTelegramMessage,
};