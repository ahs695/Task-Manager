// routes/roles.js
const express = require("express");
const router = express.Router();
const Role = require("../models/role");

// GET all roles and their permissions
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

// routes/roles.js (continued)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { permissions } = req.body;

  try {
    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ error: "Role not found" });

    role.permissions = permissions;
    await role.save();

    res.status(200).json({ message: "Permissions updated successfully", role });
  } catch (err) {
    console.error("Error updating permissions:", err);
    res.status(500).json({ error: "Failed to update permissions" });
  }
});

module.exports = router;
