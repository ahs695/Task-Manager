const express = require("express");
const router = express.Router();
const Project = require("../models/project");

// Create Project
router.post("/", async (req, res) => {
  try {
    const { projectName } = req.body;

    const newProject = new Project({ projectName });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ creationTime: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { projectName } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { projectName },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/complete", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { completionTime: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Project not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
