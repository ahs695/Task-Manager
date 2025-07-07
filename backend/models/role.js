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
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: false, // Only needed for custom org-level roles
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", RoleSchema);
