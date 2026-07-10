const User = require("../models/User");
const { getAllUsersService, createUserService, updateUserRoleService, deleteUserService } = require("../services/user.service");
const { createLog } = require("../services/log.service");
const ACTIONS = require("../constants/actions");
const AppError = require("../utils/AppError");

const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Users retrieved successfully",
      data: {
        count: users.length,
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await createUserService(req.body);

    await createLog({
      userId: req.user._id,
      mobile: req.user.mobile,
      action: ACTIONS.USER_CREATED,
      status: "SUCCESS",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: `Created user ${user.mobile}`,
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const updateRole = async (req, res, next) => {
  try {
    const user = await updateUserRoleService(req.params.id, req.body.role);

    await createLog({
      userId: req.user._id,
      mobile: req.user.mobile,
      action: ACTIONS.ROLE_UPDATED,
      status: "SUCCESS",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: `Updated role of ${user.mobile}`,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Role updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await deleteUserService(req.params.id);

    await createLog({
      userId: req.user._id,
      mobile: req.user.mobile,
      action: ACTIONS.USER_DELETED,
      status: "SUCCESS",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      message: `Deleted user ${user.mobile}`,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User deleted successfully",
      data: {},
    });
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  createUser,
  updateRole,
  deleteUser,
};