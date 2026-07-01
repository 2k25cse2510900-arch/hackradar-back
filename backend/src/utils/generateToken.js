const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      username: user.username || "",
      authProvider: user.authProvider || "email",
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn,
    }
  );
}

module.exports = generateToken;