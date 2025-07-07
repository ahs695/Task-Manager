const express = require("express");
const router = express.Router();
const Organization = require("../models/Org");
const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });
    res.json(organizations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch organizations." });
  }
});

router.post("/", async (req, res) => {
  const { orgName, email, password } = req.body;

  if (!orgName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const orgExists = await Organization.findOne({ name: orgName });
    if (orgExists) {
      return res.status(400).json({ message: "Organization already exists." });
    }

    const newOrg = await Organization.create({ name: orgName });

    const hashedPassword = await bcrypt.hash(password, 10);

    let orgRole = await Role.findOne({ rolename: "organization" });
    if (!orgRole) {
      orgRole = await Role.create({
        rolename: "organization",
        permissions: [],
      });
    }

    const user = await User.create({
      name: orgName,
      email,
      password: hashedPassword,
      role: orgRole._id,
      organization: newOrg._id,
    });

    res.status(201).json({
      message: "Organization created successfully.",
      organization: newOrg,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
