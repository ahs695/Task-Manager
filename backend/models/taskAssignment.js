const mongoose = require("mongoose");

const TaskAssignmentSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaskAssignment", TaskAssignmentSchema);
