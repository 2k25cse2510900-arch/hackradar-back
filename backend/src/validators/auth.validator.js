const { body } = require("express-validator");

const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage("Username can only contain letters, numbers, dots and underscores"),
  body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("phoneNumber").trim().notEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must include one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must include one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must include one special character"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
};
