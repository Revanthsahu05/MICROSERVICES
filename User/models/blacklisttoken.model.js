const mongoose = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true, 
  },
});
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("BlacklistToken", tokenBlacklistSchema);
