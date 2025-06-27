const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  rolename: {
    type: String,
    required: true,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
