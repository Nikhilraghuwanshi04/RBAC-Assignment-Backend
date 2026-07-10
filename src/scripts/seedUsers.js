require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const users = [
  {
    name: "Super Admin",
    mobile: "9999999991",
    role: "SUPER_ADMIN",
  },
  {
    name: "Admin",
    mobile: "9999999992",
    role: "ADMIN",
  },
  {
    name: "Manager",
    mobile: "9999999993",
    role: "MANAGER",
  },
  {
    name: "User",
    mobile: "9999999994",
    role: "USER",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany();

    await User.insertMany(users);

    console.log("Users Seeded Successfully");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seed();