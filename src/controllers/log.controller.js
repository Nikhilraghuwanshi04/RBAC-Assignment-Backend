const { getLogsService, getLoginLogsService, getLogStatsService } = require("../services/log.service");

const getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, action, status, search } = req.query;
    const result = await getLogsService({ page, limit, action, status, search });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Logs retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getLoginLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const result = await getLoginLogsService({ page, limit, status, search });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Login logs retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getLogStats = async (req, res, next) => {
  try {
    const result = await getLogStatsService();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Log statistics retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogs,
  getLoginLogs,
  getLogStats,
};
