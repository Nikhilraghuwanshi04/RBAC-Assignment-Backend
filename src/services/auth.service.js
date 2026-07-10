const User = require("../models/User");
const { createOTP } = require("./otp.service");
const { createLog } = require("./log.service");
const ACTIONS = require("../constants/actions");
const OTP = require("../models/OTP");
const { generateToken } = require("../utils/jwt");
const sendOTPService = async (mobile, req) => {
  // 1. Check user
  const user = await User.findOne({ mobile });

  if (!user) {
    return {
      statusCode: 404,
      success: false,
      message: "User not found",
    };
  }

  // 2. Check active user
  if (!user.isActive) {
    return {
      statusCode: 403,
      success: false,
      message: "User is inactive",
    };
  }

  // 3. Generate OTP
  const otpDoc = await createOTP(mobile);

  // 4. Create Log
  await createLog({
    userId: user._id,
    mobile,
    action: ACTIONS.OTP_GENERATED,
    status: "SUCCESS",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    message: "OTP generated successfully",
  });

  return {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    otp: otpDoc.otp, // Testing only
  };
};
// sendOTPService function is responsible for sending an OTP to a user's mobile number. It first checks if the user exists and is active, then generates an OTP and logs the action. Finally, it returns a response indicating the success or failure of the operation.
const verifyOTPService = async (mobile, otp, req) => {
  const user = await User.findOne({ mobile });

  if (!user) {
    return {
      statusCode: 404,
      success: false,
      message: "User not found",
    };
  }

  const otpDoc = await OTP.findOne({ mobile }).sort({ createdAt: -1 });

  if (!otpDoc) {
    await createLog({
      userId: user._id,
      mobile,
      action: ACTIONS.OTP_INVALID,
      status: "FAILED",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: "OTP not found",
    });

    return {
      statusCode: 400,
      success: false,
      message: "OTP not found",
    };
  }

  if (otpDoc.isUsed) {
    return {
      statusCode: 400,
      success: false,
      message: "OTP already used",
    };
  }

  if (new Date() > otpDoc.expiresAt) {
    await createLog({
      userId: user._id,
      mobile,
      action: ACTIONS.OTP_EXPIRED,
      status: "FAILED",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: "OTP expired",
    });

    return {
      statusCode: 400,
      success: false,
      message: "OTP expired",
    };
  }

  if (otpDoc.attemptCount >= 3) {
    return {
      statusCode: 400,
      success: false,
      message: "Maximum attempts exceeded",
    };
  }

  if (otpDoc.otp !== otp) {
    otpDoc.attemptCount += 1;
    await otpDoc.save();

    await createLog({
      userId: user._id,
      mobile,
      action: ACTIONS.OTP_INVALID,
      status: "FAILED",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: "Invalid OTP",
    });

    return {
      statusCode: 400,
      success: false,
      message: "Invalid OTP",
    };
  }

  otpDoc.isUsed = true;
  await otpDoc.save();

  const token = generateToken(user);

  await createLog({
    userId: user._id,
    mobile,
    action: ACTIONS.LOGIN_SUCCESS,
    status: "SUCCESS",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    message: "Login successful",
  });

  return {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully",
    token,
  };
};

module.exports = {
  sendOTPService,
  verifyOTPService,
};