const { sendOTPService, verifyOTPService } = require("../services/auth.service");
const AppError = require("../utils/AppError");

const sendOTP = async (req, res, next) => {
  try {
    const result = await sendOTPService(req.body.mobile, req);

    if (!result.success) {
      throw new AppError(result.message, result.statusCode);
    }

    const { statusCode, success, message, ...data } = result;
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    const result = await verifyOTPService(mobile, otp, req);

    if (!result.success) {
      throw new AppError(result.message, result.statusCode);
    }

    const { statusCode, success, message, ...data } = result;
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};