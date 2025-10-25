const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cookieParser = require("cookie-parser");
const captainRoutes = require("./routes/user.routes");
const { connectDB } = require("./db/db");
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use("/", captainRoutes);

module.exports = app;
