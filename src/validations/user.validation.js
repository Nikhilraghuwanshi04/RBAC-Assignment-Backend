const { body } = require("express-validator");
const { param } = require("express-validator");

const allowedRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "USER",
];

const updateRoleValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid User ID"),

  body("role")
    .isIn(["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"])
    .withMessage("Invalid role"),
];

const createUserValidation = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("mobile")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile must be exactly 10 digits"),

  body("role")
    .isIn(allowedRoles)
    .withMessage("Invalid role"),
];
const deleteUserValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid User ID"),
];

module.exports = {
  createUserValidation,
  updateRoleValidation,
  deleteUserValidation
};