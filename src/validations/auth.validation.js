const { body } = require("express-validator");

const sendOTPValidation = [
  body("mobile")
    .notEmpty()
    .withMessage("Mobile is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Mobile must be exactly 10 digits"),
];
const verifyOTPValidation = [
  body("mobile")
    .notEmpty()
    .withMessage("Mobile is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid mobile"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

module.exports = {
  sendOTPValidation,
  verifyOTPValidation,
};