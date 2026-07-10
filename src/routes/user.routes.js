const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { getProfile ,getAllUsers , createUser ,updateRole, deleteUser} = require("../controllers/user.controller");
const { createUserValidation, updateRoleValidation ,   deleteUserValidation,
 } = require("../validations/user.validation");
const validate = require("../middlewares/validate.middleware");


router.get("/profile", authenticate, getProfile);
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN", "MANAGER"),
  getAllUsers
);
router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "ADMIN"),
  createUserValidation,
  validate,
  createUser
);
router.patch(
  "/:id/role",
  authenticate,
  authorize("SUPER_ADMIN"),
  updateRoleValidation,
  validate,
    updateRole
);
router.delete(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN"),
  deleteUserValidation,
  validate,
  deleteUser
);

module.exports = router;