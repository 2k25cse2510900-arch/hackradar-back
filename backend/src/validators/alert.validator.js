const { body, param } = require("express-validator");

const CHANNELS = ["email", "telegram"];

const createAlertValidator = [
  body("hackathonId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Hackathon ID is required"),

  body("title")
    .optional()
    .isString()
    .trim(),

  body("channels")
    .optional()
    .isArray()
    .withMessage("Channels must be an array"),

  body("channels.*")
    .optional()
    .isIn(CHANNELS)
    .withMessage("Invalid channel"),

  body("frequency")
    .optional()
    .isIn(["once"])
    .withMessage("Only 'once' reminders are supported"),

  body("demoMode")
    .optional()
    .isBoolean(),

  body("demoMinutes")
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage("Demo minutes must be between 1 and 60"),
];

const updateAlertValidator = [
  body("title")
    .optional()
    .isString()
    .trim(),

  body("enabled")
    .optional()
    .isBoolean(),

  body("channels")
    .optional()
    .isArray(),

  body("channels.*")
    .optional()
    .isIn(CHANNELS),

  body("frequency")
    .optional()
    .isIn(["once"]),

  body("settings")
    .optional()
    .isObject(),
];

const alertIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Alert ID"),
];

module.exports = {
  createAlertValidator,
  updateAlertValidator,
  alertIdValidator,
};