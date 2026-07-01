const { body, param } = require("express-validator");

const alertPayloadValidator = [
  body("title").optional().isString().trim().notEmpty().withMessage("Title cannot be empty"),
  body("hackathonId").optional().isString().trim(),
  body("channels").optional().isArray().withMessage("Channels must be an array"),
  body("channels.*").optional().isString().trim(),
  body("frequency")
  .optional()
  .isIn(["once", "daily", "weekly", "monthly"])
  .withMessage("Frequency must be once, daily, weekly, or monthly"),
  body("enabled").optional().isBoolean().withMessage("Enabled must be a boolean"),
  body("settings").optional().isObject().withMessage("Settings must be an object"),
];

const createAlertValidator = [
  body("title").isString().trim().notEmpty().withMessage("Title is required"),
  ...alertPayloadValidator,
];

const updateAlertValidator = alertPayloadValidator;

const alertIdValidator = [
  param("id").isMongoId().withMessage("Alert id must be a valid MongoDB ObjectId"),
];

module.exports = {
  createAlertValidator,
  updateAlertValidator,
  alertIdValidator,
};
