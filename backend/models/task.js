const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ["Low", "Mid", "High"], default: "Low" },
  category: {
    type: String,
    enum: ["todo", "inprogress", "underreview", "completed"],
    required: true,
  },
  creationTime: { type: Date, default: () => new Date() },
  dueDate: { type: Date, default: null },
  comments: {
    type: [
      {
        text: { type: String, required: true },
        time: { type: Date, default: Date.now },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    default: [],
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: false,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  statusHistory: {
    type: [
      {
        status: {
          type: String,
          enum: ["todo", "inprogress", "underreview", "completed"],
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Task", taskSchema);
