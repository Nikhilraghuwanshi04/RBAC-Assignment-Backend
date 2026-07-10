const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");

const createOTP = async (mobile) => {
  // Remove previous OTPs
  await OTP.deleteMany({ mobile });

  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 60 * 1000);

  const otpDoc = await OTP.create({
    mobile,
    otp,
    expiresAt,
  });

  return otpDoc;
};

module.exports = {
  createOTP,
};