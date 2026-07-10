const User = require("../models/User");

const getAllUsersService = async () => {
  return await User.find().select("-__v");
};

const createUserService = async ({ name, mobile, role }) => {
  const existingUser = await User.findOne({ mobile });

  if (existingUser) {
    throw new Error("Mobile already exists");
  }

  const user = await User.create({
    name,
    mobile,
    role,
    isActive: true,
  });

  return user;
};

const updateUserRoleService = async (id, role) => {

  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  user.role = role;

  await user.save();

  return user;
};

const deleteUserService = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(id);

  return user;
};

module.exports = {
  getAllUsersService,
  createUserService,
  updateUserRoleService,
  deleteUserService
};