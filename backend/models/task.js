const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  label: { type: String }, // ✅ Added label
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
    default: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // ✅ Zero out time
      return today;
    },
  },
});

module.exports = mongoose.model("Task", taskSchema);
