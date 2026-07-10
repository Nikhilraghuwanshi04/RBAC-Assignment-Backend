const { createLog } = require("../services/log.service");
const ACTIONS = require("../constants/actions");
const AppError = require("../utils/AppError");

const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        await createLog({
          userId: req.user._id,
          mobile: req.user.mobile,
          action: ACTIONS.ACCESS_DENIED,
          status: "FAILED",
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
          message: `Access denied for role ${req.user.role}`,
        });

        throw new AppError("Access Denied", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;