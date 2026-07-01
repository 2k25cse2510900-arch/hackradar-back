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
  try {
    const alerts = await Alert.find({
      enabled: true,
      alertTime: {
        $lte: new Date(),
      },
    });

    if (!alerts.length) return;

    console.log(`⏰ Running ${alerts.length} reminder(s)`);

    for (const alert of alerts) {
      try {
        const user = await User.findById(
          alert.user
        );

        if (!user) continue;

        if (
          user.email &&
          alert.channels.includes("email")
        ) {
          await sendEmail({
            to: user.email,
            subject: `Reminder : ${alert.title}`,
            html: buildReminderEmail({
              firstName:
                user.firstName || "Hacker",
              title: alert.title,
            }),
          });

          console.log(`📧 Email sent -> ${user.email}`);
        }

        if (
          user.telegramVerified &&
          user.telegramChatId &&
          alert.channels.includes(
            "telegram"
          )
        ) {
          await sendTelegramMessage(
            user.telegramChatId,
            buildTelegramReminder({
              firstName:
                user.firstName || "Hacker",
              title: alert.title,
            })
          );

          console.log(`📲 Telegram sent -> ${user.telegramChatId}`);
        }

        alert.enabled = false;
        alert.lastTriggeredAt =
          new Date();

        await alert.save();
      } catch (err) {
        console.error(
  `❌ Alert "${alert.title}" failed`,
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