const { body } = require("express-validator");

const profileValidator = [
  body("name").optional().isString().trim(),
  body("college").optional().isString().trim(),
  body("year").optional().isString().trim(),
  body("degree").optional().isString().trim(),
  body("phoneNumber").optional().isString().trim(),
  body("domains").optional().isArray().withMessage("Domains must be an array"),
  body("domains.*").optional().isString().trim(),
  body("skills").optional().isArray().withMessage("Skills must be an array"),
  body("skills.*").optional().isString().trim(),
  body("experienceLevel")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Experience level is invalid"),
  body("goals").optional().isArray().withMessage("Goals must be an array"),
  body("goals.*").optional().isString().trim(),
  body("preferredMode").optional().isString().trim(),
  body("availability").optional().isString().trim(),
];

module.exports = {
  profileValidator,
};
