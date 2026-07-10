const Log = require("../models/Log");
const User = require("../models/User");
const ACTIONS = require("../constants/actions");

const createLog = async ({
  userId = null,
  mobile = null,
  action,
  status,
  ipAddress = "",
  userAgent = "",
  message = "",
}) => {
  try {
    await Log.create({
      userId,
      mobile,
      action,
      status,
      ipAddress,
      userAgent,
      message,
    });
  } catch (error) {
    console.error("Error creating log:", error.message);
  }
};

const getLogsService = async ({ page = 1, limit = 10, action, status, search }) => {
  const query = {};

  if (action) {
    query.action = action;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { mobile: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { ipAddress: { $regex: search, $options: "i" } },
      { action: { $regex: search, $options: "i" } },
    ];
  }

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const total = await Log.countDocuments(query);
  const logs = await Log.find(query)
    .populate("userId", "name mobile role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  return {
    logs,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  };
};

const getLoginLogsService = async ({ page = 1, limit = 10, status, search }) => {
  const query = {
    action: { $in: [ACTIONS.LOGIN_SUCCESS, ACTIONS.LOGIN_FAILED] },
  };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { mobile: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
      { ipAddress: { $regex: search, $options: "i" } },
    ];
  }

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const total = await Log.countDocuments(query);
  const logs = await Log.find(query)
    .populate("userId", "name mobile role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  return {
    logs,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  };
};

const getLogStatsService = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalUsers, totalLogs, todayLogins, todayOTPs] = await Promise.all([
    User.countDocuments(),
    Log.countDocuments(),
    Log.countDocuments({
      action: ACTIONS.LOGIN_SUCCESS,
      createdAt: { $gte: startOfToday },
    }),
    Log.countDocuments({
      action: ACTIONS.OTP_GENERATED,
      createdAt: { $gte: startOfToday },
    }),
  ]);

  return {
    totalUsers,
    totalLogs,
    todayLogins,
    todayOTPs,
  };
};

module.exports = {
  createLog,
  getLogsService,
  getLoginLogsService,
  getLogStatsService,
};