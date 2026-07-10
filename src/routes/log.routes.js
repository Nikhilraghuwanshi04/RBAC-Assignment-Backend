const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const { getLogs, getLoginLogs, getLogStats } = require("../controllers/log.controller");
const { getLogsValidation, getLoginLogsValidation } = require("../validations/log.validation");

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  getLogsValidation,
  validate,
  getLogs
);

router.get(
  "/login",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  getLoginLogsValidation,
  validate,
  getLoginLogs
);

router.get(
  "/stats",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  getLogStats
);

module.exports = router;
