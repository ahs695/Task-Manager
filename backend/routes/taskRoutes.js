const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const TaskAssignment = require("../models/taskAssignment");
const jwt = require("jsonwebtoken");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let tasks;

    if (["admin", "superAdmin"].includes(decoded.role)) {
      tasks = await Task.find();
    } else {
      const assignments = await TaskAssignment.find({ userId: decoded.id });
      const taskIds = assignments.map((a) => a.taskId);
      tasks = await Task.find({ _id: { $in: taskIds } });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task with statusHistory
router.post("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const taskData = req.body;

    const newTask = new Task({
      ...taskData,
      statusHistory: [
        {
          status: taskData.category || "todo",
          user: decoded.id,
        },
      ],
    });

    const savedTask = await newTask.save();

    if (taskData.project) {
      await TaskAssignment.create({
        taskId: savedTask._id,
        userId: taskData.user || null,
        projectId: taskData.project,
      });
    }

    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update task and statusHistory
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = req.body;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updateFields = {};
    const updateOps = {};

    // Category/status update
    const categoryChanged =
      taskData.category && taskData.category !== existingTask.category;
    if (categoryChanged) {
      updateFields.category = taskData.category;
      updateOps.$push = {
        statusHistory: {
          status: taskData.category,
          user: decoded.id,
          time: new Date(),
        },
      };
    }

    // Append to comments if provided
    if (taskData.comments && Array.isArray(taskData.comments)) {
      const newComment = taskData.comments[taskData.comments.length - 1];
      if (newComment) {
        updateOps.$push = {
          ...updateOps.$push,
          comments: newComment,
        };
      }
    }

    // Other direct updates
    if (taskData.title) updateFields.title = taskData.title;
    if (taskData.description) updateFields.description = taskData.description;
    if (taskData.dueDate) updateFields.dueDate = taskData.dueDate;
    if (taskData.priority) updateFields.priority = taskData.priority;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        ...updateFields,
        ...updateOps,
      },
      { new: true, runValidators: true }
    );

    // TaskAssignment update
    if (taskData.project) {
      await TaskAssignment.updateOne(
        { taskId },
        {
          userId: taskData.user || null,
          projectId: taskData.project,
        },
        { upsert: true }
      );
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
