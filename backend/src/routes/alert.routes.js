const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const alertController = require("../controllers/alert.controller");
const {
  alertIdValidator,
  createAlertValidator,
  updateAlertValidator,
} = require("../validators/alert.validator");

router.get(
  "/",
  authenticate,
  alertController.listAlerts
);

router.post(
  "/",
  authenticate,
  createAlertValidator,
  validate,
  alertController.createAlert
);

router.put(
  "/:id",
  authenticate,
  alertIdValidator,
  updateAlertValidator,
  validate,
  alertController.updateAlert
);

router.delete(
  "/:id",
  authenticate,
  alertIdValidator,
  validate,
  alertController.deleteAlert
);

module.exports = router;
