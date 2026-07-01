const { sendEmail } = require("./email.service");
const Alert = require("../models/Alert");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const hackathonService = require("./hackathon.service");
const logger = require("../utils/logger");

const REMINDERS = [
  {
    type: "7d",
    offset: 7 * 24 * 60 * 60 * 1000,
  },
  {
    type: "3d",
    offset: 3 * 24 * 60 * 60 * 1000,
  },
  {
    type: "1d",
    offset: 24 * 60 * 60 * 1000,
  },
  {
    type: "1h",
    offset: 60 * 60 * 1000,
  },
];

async function listAlerts(userId) {
  return Alert.find({ user: userId }).sort({
    alertTime: 1,
  });
}

function getReminderSchedule(hackathon, payload) {
  if (payload.demoMode) {
    return [
      {
        type: "1h",
        remindAt: new Date(
          Date.now() +
            Number(payload.demoMinutes || 2) * 60000
        ),
      },
    ];
  }

  const deadline = new Date(
    hackathon.registrationDeadline ||
      hackathon.deadline
  );

  if (Number.isNaN(deadline.getTime())) {
    throw new ApiError(
      422,
      "Invalid Hackathon Deadline"
    );
  }

  return REMINDERS.map((item) => ({
    type: item.type,
    remindAt: new Date(
      deadline.getTime() - item.offset
    ),
  }));
}

async function sendAlertCreatedEmail(
  user,
  hackathonName,
  count
) {
  if (!user?.email) return;

  try {
    await sendEmail({
      to: user.email,
      subject: "🎉 HackRadar Alert Created",
      html: `
      <h2>Hello ${user.firstName || "Hacker"} 👋</h2>

      <p>Your reminder has been created successfully.</p>

      <h3>${hackathonName}</h3>

      <p>Total reminders scheduled: <b>${count}</b></p>

      <ul>
        <li>7 Days Before</li>
        <li>3 Days Before</li>
        <li>1 Day Before</li>
        <li>1 Hour Before</li>
      </ul>

      <br>

      <p>Happy Hacking 🚀</p>

      <p>HackRadar Team</p>
      `,
    });

    logger.info(
      `Confirmation Email -> ${user.email}`
    );
  } catch (err) {
    logger.warn(err.message);
  }
}

async function createAlert(userId, payload) {
  const hackathon =
    await hackathonService.getHackathonById(
      payload.hackathonId
    );

  const reminders =
    getReminderSchedule(
      hackathon,
      payload
    );

  const createdAlerts = [];

  for (const reminder of reminders) {
    const alert = await Alert.create({
      user: userId,

      hackathonId: payload.hackathonId,

      title:
        payload.title ||
        hackathon.name,

      channels:
        payload.channels || [
          "email",
          "telegram",
        ],

      reminderType:
        reminder.type,

      frequency: "once",

      enabled: true,

      alertTime:
        reminder.remindAt,

      settings:
        payload.settings || {},
    });

    createdAlerts.push(alert);
  }

  const user =
    await User.findById(userId);

  await sendAlertCreatedEmail(
    user,
    hackathon.name,
    createdAlerts.length
  );

  return createdAlerts;
}

async function updateAlert(
  userId,
  alertId,
  payload
) {
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