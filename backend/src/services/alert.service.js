const { sendEmail } = require("./email.service");
const Alert = require("../models/Alert");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");
const logger = require("../utils/logger");

async function listAlerts(userId) {
  return Alert.find({ user: userId }).sort({ createdAt: -1 });
}

function getAlertTime(hackathon, payload) {
  if (payload.demoMode) {
    const minutes = Number(payload.demoMinutes || 2);
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  const deadline = new Date(hackathon.registrationDeadline || hackathon.deadline);
  if (Number.isNaN(deadline.getTime())) {
    throw new ApiError(422, "Hackathon registration deadline is invalid");
  }

  return new Date(deadline.getTime() - 24 * 60 * 60 * 1000);
}

async function sendAlertCreatedEmail(user, alert, alertTime) {
  if (!user?.email) return;

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  await sendEmail({
    to: user.email,
    subject: "HackRadar Alert Created",
    html: `
      <h2>Hello ${fullName},</h2>
      <p>Your HackRadar alert has been created successfully.</p>
      <hr>
      <h3>Alert Details</h3>
      <p><strong>Title:</strong> ${alert.title}</p>
      <p><strong>Frequency:</strong> ${alert.frequency}</p>
      <p><strong>Status:</strong> ${alert.enabled ? "Enabled" : "Disabled"}</p>
      <p><strong>Reminder Time:</strong> ${alertTime}</p>
      <br>
      <p>We'll notify you before the hackathon registration deadline.</p>
      <br>
      <h3>Happy Hacking</h3>
      <p>HackRadar Team</p>
    `,
  }).catch((error) => {
    logger.warn("Alert confirmation email failed:", error.message);
  });
}

async function createAlert(userId, payload) {
  const hackathon = await hackathonService.getHackathonById(payload.hackathonId);
  const alertTime = getAlertTime(hackathon, payload);

  const alert = await Alert.create({
    user: userId,
    hackathonId: payload.hackathonId,
    title: payload.title,
    channels: payload.channels || ["email", "telegram"],
    frequency: payload.frequency || "once",
    enabled: true,
    alertTime,
    settings: payload.settings || {},
  });

  const user = await User.findById(userId);
  await sendAlertCreatedEmail(user, alert, alertTime);

  return alert;
}

async function updateAlert(userId, alertId, payload) {
  if (payload.hackathonId) {
    await hackathonService.getHackathonById(payload.hackathonId);
  }

  const alert = await Alert.findOneAndUpdate({ _id: alertId, user: userId }, payload, {
    new: true,
    runValidators: true,
  });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

async function deleteAlert(userId, alertId) {
  const alert = await Alert.findOneAndDelete({
    _id: alertId,
    user: userId,
  });

  if (!alert) {
    throw new ApiError(404, "Alert not found");
  }

  return alert;
}

module.exports = {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};
