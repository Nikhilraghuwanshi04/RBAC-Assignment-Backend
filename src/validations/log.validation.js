const { query } = require("express-validator");

const getLogsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("action")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Action cannot be empty"),
  query("status")
    .optional()
    .isIn(["SUCCESS", "FAILED"])
    .withMessage("Status must be SUCCESS or FAILED"),
  query("search")
    .optional()
    .trim(),
];

const getLoginLogsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["SUCCESS", "FAILED"])
    .withMessage("Status must be SUCCESS or FAILED"),
  query("search")
    .optional()
    .trim(),
];

module.exports = {
  getLogsValidation,
  getLoginLogsValidation,
};
