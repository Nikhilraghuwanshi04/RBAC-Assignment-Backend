const express = require("express");

const router = express.Router();

const { sendOTP, verifyOTP } = require("../controllers/auth.controller");

const {
  sendOTPValidation,
  verifyOTPValidation,
} = require("../validations/auth.validation");

const validate = require("../middlewares/validate.middleware");

// Send OTP
router.post(
  "/send-otp",
  sendOTPValidation,
  validate,
  sendOTP
);

// Verify OTP
router.post(
  "/verify-otp",
  verifyOTPValidation,
  validate,
  verifyOTP
);

module.exports = router;