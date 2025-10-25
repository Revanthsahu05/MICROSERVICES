const express = require("express");
const router = express.Router();
const {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  getCaptainProfile,
  toggleAvailability,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/authmiddleware");

router.post("/register", registerCaptain);
router.post("/login", loginCaptain);
router.post("/logout", authMiddleware, logoutCaptain);
router.get("/profile", authMiddleware, getCaptainProfile);
router.patch("/toggle-availability", authMiddleware, toggleAvailability);
module.exports = router;
