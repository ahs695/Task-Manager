const express = require("express");
const router = express.Router();
const TaskAssignment = require("../models/taskAssignment");

// GET all task assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await TaskAssignment.find().populate(
      "taskId userId projectId"
    );
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
