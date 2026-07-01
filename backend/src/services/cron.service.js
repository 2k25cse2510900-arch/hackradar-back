const cron = require("node-cron");

const Alert = require("../models/Alert");
const User = require("../models/User");

const { sendEmail } = require("./email.service");
const { sendTelegramMessage } = require("./telegram.service");

const {
  buildReminderEmail,
} = require("../templates/email.template");

const {
  buildTelegramReminder,
} = require("../templates/telegram.template");

cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking alerts...");

  try {
    const now = new Date();

    const alerts = await Alert.find({
      enabled: true,
      alertTime: { $lte: now },
    });

    if (!alerts.length) {
      return;
    }

    console.log(`✅ ${alerts.length} alert(s) found`);

    for (const alert of alerts) {
      try {
        const user = await User.findById(alert.user);

        if (!user) {
          continue;
        }

        const canSendEmail =
          Boolean(user.email) &&
          alert.channels.includes("email");

        const canSendTelegram =
          Boolean(user.telegramVerified) &&
          Boolean(user.telegramChatId) &&
          alert.channels.includes("telegram");

        // =========================
        // EMAIL
        // =========================

        if (canSendEmail) {
          await sendEmail({
            to: user.email,
            subject: `⏰ Reminder: ${alert.title}`,
            html: buildReminderEmail({
              firstName: user.firstName || "Hacker",
              title: alert.title,
            }),
          });

          console.log(
            `📧 Email sent -> ${user.email}`
          );
        }

        // =========================
        // TELEGRAM
        // =========================

        if (canSendTelegram) {
          await sendTelegramMessage(
            user.telegramChatId,
            buildTelegramReminder({
              firstName: user.firstName || "Hacker",
              title: alert.title,
            })
          );

          console.log(
            `📲 Telegram sent -> ${user.telegramChatId}`
          );
        }

        // =========================
        // MARK ALERT COMPLETE
        // =========================

        alert.enabled = false;
        alert.lastTriggeredAt = new Date();

        await alert.save();

        console.log(
          `✅ Alert completed -> ${alert.title}`
        );
      } catch (err) {
        console.error(
          `❌ Failed Alert (${alert.title})`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error(
      "❌ Cron Service Error:",
      err.message
    );
  }
});