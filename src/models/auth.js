    const mongoose = require("mongoose");

const userAuthSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },

  { collection: "auth", versionKey: false }
);

const User = mongoose.model("UserAuth", userAuthSchema);

module.exports = User;
