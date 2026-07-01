const User = require("../models/User");

async function findOrCreateGoogleUser(profile) {
  const email = profile.emails?.[0]?.value?.toLowerCase();
  if (!email) {
    throw new Error("Google profile did not include an email address");
  }

  const existingByGoogleId = await User.findOne({ googleId: profile.id });
  if (existingByGoogleId) {
    return existingByGoogleId;
  }

  const existingByEmail = await User.findOne({ email });
  if (existingByEmail) {
    existingByEmail.googleId = profile.id;
    await existingByEmail.save();
    return existingByEmail;
  }

  const firstName = profile.name?.givenName || "";
  const lastName = profile.name?.familyName || "";
  const name = profile.displayName || `${firstName} ${lastName}`.trim() || "HackRadar User";

  return User.create({
    firstName,
    lastName,
    email,
    googleId: profile.id,
    authProvider: "google",
    profile: { name },
  });
}

module.exports = {
  findOrCreateGoogleUser,
};
