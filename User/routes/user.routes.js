const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUserProfile,
} = require("../controllers/user.controller");
const { loginUser } = require("../controllers/user.controller");
const { logoutUser } = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authmiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", authMiddleware, getUserProfile);
module.exports = router;
