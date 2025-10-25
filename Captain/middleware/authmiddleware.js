const blacklistedToken = require("../models/blacklisttoken.model");
const jwt = require("jsonwebtoken");
module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const blacklisted = await blacklistedToken.findOne({
      token,
    });
    if (blacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
