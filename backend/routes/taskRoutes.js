const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const TaskAssignment = require("../models/taskAssignment");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new task and related TaskAssignment
router.post("/", async (req, res) => {
  try {
    const taskData = req.body;

    const newTask = new Task(taskData);
    const savedTask = await newTask.save();

    // Create TaskAssignment if project is provided
    if (taskData.project) {
      const assignment = new TaskAssignment({
        taskId: savedTask._id,
        userId: taskData.user || null,
        projectId: taskData.project,
      });

      await assignment.save();
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update task and update/create TaskAssignment
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (taskData.project) {
      const existingAssignment = await TaskAssignment.findOne({ taskId });

      if (existingAssignment) {
        existingAssignment.userId = taskData.user || null;
        existingAssignment.projectId = taskData.project;
        await existingAssignment.save();
      } else {
        const newAssignment = new TaskAssignment({
          taskId,
          userId: taskData.user || null,
          projectId: taskData.project,
        });
        await newAssignment.save();
      }
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (deletedTask) {
      await TaskAssignment.deleteOne({ taskId: req.params.id });
    }

    res.status(200).json({ message: "Task and assignment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
