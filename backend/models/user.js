const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },

  // Primary organization
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: false,
  },

  // Additional organizations for user-type roles
  organizations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: [],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
