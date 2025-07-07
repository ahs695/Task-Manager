const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const TaskAssignment = require("../models/taskAssignment");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { projectName, organization } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const newProject = new Project({ projectName, organization });
    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const role = decoded.role;
    const userId = decoded.id;

    let projects;

    if (role === "superAdmin") {
      // All projects, all organizations
      projects = await Project.find()
        .populate("organization")
        .sort({ creationTime: -1 });
    } else if (role === "admin" || role === "organization") {
      // Projects within their own organization
      const user = await User.findById(userId);
      if (!user.organization)
        return res.status(403).json({ message: "Organization not assigned" });

      projects = await Project.find({ organization: user.organization })
        .populate("organization")
        .sort({ creationTime: -1 });
    } else {
      // Regular user: get assigned projects only
      const assignments = await TaskAssignment.find({ userId: decoded.id });
      const projectIds = [
        ...new Set(assignments.map((a) => a.projectId.toString())),
      ];

      projects = await Project.find({
        _id: { $in: projectIds },
      })
        .populate("organization")
        .sort({ creationTime: -1 });
    }

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
