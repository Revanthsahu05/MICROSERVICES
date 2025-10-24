const mongoose = require("mongoose");
function connectDB() {
  mongoose
    .connect(process.env.mongoURL)
    .then(() => {
      console.log("User Service Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
}
module.exports = { connectDB };
