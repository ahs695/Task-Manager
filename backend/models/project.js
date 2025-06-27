// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  creationTime: { type: Date, default: Date.now },
  completionTime: { type: Date },
});

module.exports = mongoose.model("Project", projectSchema);
