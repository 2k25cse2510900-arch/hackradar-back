const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.emailUser,
    pass: env.emailPass,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("Email Transport Error:", err.message);
  } else {
    console.log("Email Transport Ready");
  }
});

async function sendEmail({
  to,
  subject,
  html,
}) {
  if (!to) return false;

  try {
    await transporter.sendMail({
      from: `"HackRadar Alerts" <${env.emailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent -> ${to}`);

    return true;
  } catch (error) {
    console.error(
      "Email Error:",
      error.message
    );

    return false;
  }
}

module.exports = {
  sendEmail,
};