const { sendEmail } = require("./email.service");
const Alert = require("../models/Alert");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");
const logger = require("../utils/logger");

async function listAlerts(userId) {
  return Alert.find({ user: userId }).sort({
    createdAt: -1,
  });
}

function getAlertTime(hackathon, payload) {
  // Demo Mode
  if (payload.demoMode) {
    const minutes = Number(payload.demoMinutes || 2);

    return new Date(
      Date.now() + minutes * 60 * 1000
    );
  }

  // Production Mode
  const deadline = new Date(
    hackathon.registrationDeadline ||
      hackathon.deadline
  );

  if (Number.isNaN(deadline.getTime())) {
    throw new ApiError(
      422,
      "Hackathon registration deadline is invalid"
    );
  }

  // Default reminder = 24 Hours Before

  return new Date(
    deadline.getTime() - 24 * 60 * 60 * 1000
  );
}

async function sendAlertCreatedEmail(
  user,
  alert,
  alertTime
) {
  if (!user?.email) return;

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    "User";

  try {
    await sendEmail({
      to: user.email,

      subject: "🎉 HackRadar Alert Created",

      html: `
      <h2>Hello ${fullName},</h2>

      <p>Your HackRadar alert has been created successfully.</p>

      <hr>

      <h3>Alert Details</h3>

      <p><strong>Hackathon:</strong> ${alert.title}</p>

      <p><strong>Reminder Time:</strong> ${alertTime}</p>

      <p><strong>Channels:</strong> ${alert.channels.join(
        ", "
      )}</p>

      <p><strong>Frequency:</strong> ${alert.frequency}</p>

      <br>

      <p>Happy Hacking 🚀</p>

      <p>HackRadar Team</p>
      `,
    });

    logger.info(
      `Confirmation email sent -> ${user.email}`
    );
  } catch (err) {
    logger.warn(
      "Confirmation email failed:",
      err.message
    );
  }
}

async function createAlert(userId, payload) {
  // Verify Hackathon

  const hackathon =
    await hackathonService.getHackathonById(
      payload.hackathonId
    );

  // Generate Alert Time

  const alertTime = getAlertTime(
    hackathon,
    payload
  );

  // Create Alert

  const alert = await Alert.create({
    user: userId,

    hackathonId: payload.hackathonId,

    title:
      payload.title ||
      hackathon.title,

    channels:
      payload.channels || [
        "email",
        "telegram",
      ],

    frequency:
      payload.frequency || "once",

    enabled: true,

    alertTime,

    settings:
      payload.settings || {},
  });

  // Send Confirmation

  const user = await User.findById(
    userId
  );

  await sendAlertCreatedEmail(
    user,
    alert,
    alertTime
  );

  return alert;
}

async function updateAlert(
  userId,
  alertId,
  payload
) {
  if (payload.hackathonId) {
    await hackathonService.getHackathonById(
      payload.hackathonId
    );
  }

  const alert =
    await Alert.findOneAndUpdate(
      {
        _id: alertId,
        user: userId,
      },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!alert) {
    throw new ApiError(
      404,
      "Alert not found"
    );
  }

  return alert;
}

async function deleteAlert(
  userId,
  alertId
) {
  const alert =
    await Alert.findOneAndDelete({
      _id: alertId,
      user: userId,
    });

  if (!alert) {
    throw new ApiError(
      404,
      "Alert not found"
    );
  }

  return alert;
}

module.exports = {
  listAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
};