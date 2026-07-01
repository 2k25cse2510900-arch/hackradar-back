const crypto = require("crypto");

async function getProfile(user) {
  const profile = user.profile?.toObject?.() || user.profile || {};
  return {
    ...profile,
    phoneNumber: profile.phoneNumber || user.phoneNumber || "",
  };
}

async function updateProfile(user, profile) {
  user.profile = {
    ...user.profile?.toObject?.(),
    ...profile,
  };

  if (typeof profile.phoneNumber !== "undefined") {
    user.phoneNumber = profile.phoneNumber;
  }

  await user.save();

  return user.profile;
}

async function generateTelegramVerificationCode(user) {
  const code = crypto.randomInt(100000, 999999).toString();

  user.telegramVerificationCode = code;
  user.telegramVerificationExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  user.telegramVerified = false;

  await user.save();

  return {
    code,
    expires: user.telegramVerificationExpires,
  };
}

async function verifyTelegram(user, chatId) {
  user.telegramChatId = chatId;
  user.telegramVerified = true;

  user.telegramVerificationCode = "";
  user.telegramVerificationExpires = null;

  await user.save();

  return user;
}

async function getTelegramStatus(user) {
  return {
    connected: user.telegramVerified,
    verified: user.telegramVerified,
    chatId: user.telegramChatId,
  };
}

module.exports = {
  getProfile,
  updateProfile,
  generateTelegramVerificationCode,
  verifyTelegram,
  getTelegramStatus,
};
