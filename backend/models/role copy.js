const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  resource: { type: String, required: true }, // e.g. "Dashboard"
  actions: [
    {
      type: String,
      enum: ["view", "create", "edit", "delete"],
    },
  ],
});

const RoleSchema = new mongoose.Schema({
  rolename: {
    type: String,
    required: true,
    default: "user",
  },
  permissions: [PermissionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
