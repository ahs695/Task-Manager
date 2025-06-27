const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: {
    type: String,
    enum: ["Low", "Mid", "High"],
    default: "Low",
  },
  category: {
    type: String,
    enum: ["todo", "inprogress", "underreview", "completed"],
    required: true,
  },
  creationTime: {
    type: Date,
    default: () => new Date(),
  },
  startedTime: { type: Date, default: null },
  reviewTime: { type: Date, default: null },
  completionTime: { type: Date, default: null },
  dueDate: {
    type: Date,
    required: false,
    default: null,
  },

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

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: null,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
