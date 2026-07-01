const bcrypt = require("bcrypt");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

async function register(payload) {
  const existing = await User.findOne({
    $or: [{ email: payload.email.toLowerCase() }, { username: payload.username }],
  });

  if (existing) {
    throw new ApiError(409, "A user with this email or username already exists");
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const name = `${payload.firstName} ${payload.lastName}`.trim();
  const user = await User.create({
    firstName: payload.firstName,
    lastName: payload.lastName,
    username: payload.username,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    passwordHash,
    authProvider: "email",
    profile: { name, phoneNumber: payload.phoneNumber },
  });

  return {
    user: user.toSafeObject(),
    token: generateToken(user),
  };
}

async function login(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: user.toSafeObject(),
    token: generateToken(user),
  };
}

function buildAuthPayload(user) {
  return {
    user: typeof user.toSafeObject === "function" ? user.toSafeObject() : user,
    token: generateToken(user),
  };
}

module.exports = {
  register,
  login,
  buildAuthPayload,
};
