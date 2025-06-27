const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

router.post("/create-user", authenticateToken, async (req, res) => {
  const { name, role, email, password } = req.body;

  try {
    const requestingUser = await User.findById(req.user.id).populate("role");
    const requesterRole = requestingUser.role.rolename;

    const isAllowed =
      requesterRole === "superAdmin" ||
      (requesterRole === "admin" &&
        ["user", "staff"].includes(role.toLowerCase()) === true);

    if (requesterRole === "admin" && !isAllowed && role !== "custom") {
      return res
        .status(403)
        .json({ message: "Admins can only create staff/user/custom roles" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    let roleDoc = await Role.findOne({ rolename: role });
    if (!roleDoc) {
      if (requesterRole !== "superAdmin" && requesterRole !== "admin") {
        return res.status(403).json({ message: "Role not allowed" });
      }

      roleDoc = new Role({ rolename: role });
      await roleDoc.save();
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Find or create the default role
    let userRole = await Role.findOne({ rolename: "user" });
    if (!userRole) {
      userRole = new Role({ rolename: "user" });
      await userRole.save();
      console.log("Created role: user");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole._id,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role.rolename },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("role", "rolename");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, role, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSelf = req.user.id === req.params.id;
    const isAdmin = ["admin", "superAdmin"].includes(req.user.role);

    if (!isSelf && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    if (name) user.name = name;

    if (role && isAdmin) {
      const currentRole = await Role.findById(user.role).lean();
      if (!currentRole) {
        return res
          .status(400)
          .json({ message: "Current user role is invalid" });
      }

      // Only update role if it's different
      if (currentRole.rolename !== role) {
        const newRole = await Role.findOne({ rolename: role });
        if (!newRole) return res.status(400).json({ message: "Invalid role" });

        user.role = newRole._id;
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const isSelf = req.user.id === id;
    const isAdmin = ["admin", "superAdmin"].includes(req.user.role);

    if (!isSelf && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this user" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
