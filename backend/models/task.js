const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  label: { type: String },
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
  startedTime: { type: Date, default: null }, // ✅ New
  reviewTime: { type: Date, default: null }, // ✅ New
  completionTime: { type: Date, default: null }, // ✅ Already added earlier
});

module.exports = mongoose.model("Task", taskSchema);
