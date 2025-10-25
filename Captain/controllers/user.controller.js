const usermodel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklisttoken.model");

const registerCaptain = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Captain already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new usermodel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.status(201).json({ message: "Captain registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginCaptain = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userobject = user.toObject();
    delete userobject.password;
    res.cookie("token", token);
    res.send({ token, user: userobject });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutCaptain = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const blacklistedToken = new blacklistModel({
      token,
      expiresAt: new Date(decodedToken.exp * 1000),
    });
    await blacklistedToken.save();
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCaptainProfile = async (req, res) => {
  // console.log("Fetching captain profile for userId:", req.userId);
  try {
    const userId = req.userId;
    const user = await usermodel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Captain not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const toggleAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Captain not found" });
    }
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.status(200).json({ message: "Availability status updated", isAvailable: user.isAvailable });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  registerCaptain,
  loginCaptain,
  logoutCaptain,
  getCaptainProfile,
  toggleAvailability,
};
