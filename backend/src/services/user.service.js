const crypto = require("crypto");

async function getProfile(user) {
  const profile = user.profile?.toObject?.() || user.profile || {};

  return {
    ...profile,
    phoneNumber: user.phoneNumber || "",
  };
}

async function updateProfile(user, profile) {
  user.profile = {
    ...(user.profile?.toObject?.() || {}),
    ...profile,
  };

  if ("phoneNumber" in profile) {
    user.phoneNumber = profile.phoneNumber;
  }

  await user.save();

  return {
    ...user.profile.toObject(),
    phoneNumber: user.phoneNumber,
  };
}

async function generateTelegramVerificationCode(user) {
  const code = crypto.randomInt(100000, 999999).toString();

  user.telegramVerificationCode = code;
  user.telegramVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  user.telegramVerified = false;

  await user.save();

  return {
    code,
    expires: user.telegramVerificationExpires,
  };
}

async function verifyTelegram(user, chatId) {
  user.telegramChatId = String(chatId);
  user.telegramVerified = true;

  user.telegramVerificationCode = "";
  user.telegramVerificationExpires = null;

  await user.save();

  return user.toSafeObject();
}

async function disconnectTelegram(user) {
  user.telegramChatId = null;
  user.telegramVerified = false;
  user.telegramVerificationCode = "";
  user.telegramVerificationExpires = null;

  await user.save();

  return user.toSafeObject();
}

async function getTelegramStatus(user) {
  return {
    connected: !!user.telegramVerified,
    verified: !!user.telegramVerified,
    chatId: user.telegramChatId,
  };
}

module.exports = {
  getProfile,
  updateProfile,
 generateTelegramVerificationCode,
  verifyTelegram,
  disconnectTelegram,
  getTelegramStatus,
};