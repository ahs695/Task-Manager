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
  const { name, role, email, password, organization: orgFromBody } = req.body;

  try {
    const requestingUser = await User.findById(req.user.id).populate("role");
    const requesterRole = requestingUser.role.rolename;

    const isAllowed =
      requesterRole === "superAdmin" ||
      (requesterRole === "admin" &&
        ["user", "staff"].includes(role.toLowerCase()));

    if (requesterRole === "admin" && !isAllowed && role !== "custom") {
      return res
        .status(403)
        .json({ message: "Admins can only create staff/user/custom roles" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let organization = null;
    if (requesterRole === "superAdmin") {
      if (!orgFromBody) {
        return res.status(400).json({ message: "Organization is required" });
      }
      organization = orgFromBody;
    } else {
      if (!requestingUser.organization) {
        return res.status(403).json({ message: "Organization not assigned" });
      }
      organization = requestingUser.organization;
    }

    let roleDoc = await Role.findOne({ rolename: role });
    if (!roleDoc) {
      if (
        requesterRole !== "superAdmin" &&
        requesterRole !== "admin" &&
        requesterRole !== "organization"
      ) {
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
      organization,
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
    const user = await User.findOne({ email })
      .populate("role")
      .populate("organization");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokenPayload = {
      id: user._id,
      role: user.role.rolename,
      permissions: user?.role?.permissions ?? [],
    };

    if (user.organization) {
      tokenPayload.organization = {
        id: user.organization._id,
        name: user.organization.name,
      };
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        organization: user.organization
          ? {
              id: user.organization._id,
              name: user.organization.name,
            }
          : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id)
      .populate("role")
      .populate("organization");

    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    const requesterRole = requestingUser.role.rolename;

    let users;

    if (requesterRole === "superAdmin") {
      users = await User.find()
        .populate("role", "rolename")
        .populate("organization", "name")
        .populate("organizations", "name");
    } else if (requesterRole === "admin" || requesterRole === "organization") {
      if (!requestingUser.organization) {
        return res
          .status(403)
          .json({ message: "Organization not assigned to user" });
      }

      const orgId = requestingUser.organization._id;

      users = await User.find({
        $or: [
          { organization: orgId }, // Primary org match
          { organizations: orgId }, // Included in org array
        ],
      })
        .populate("role", "rolename")
        .populate("organization", "name")
        .populate("organizations", "name");
    } else {
      const user = await User.findById(req.user.id)
        .populate("role", "rolename")
        .populate("organization", "name")
        .populate("organizations", "name");

      users = [user];
    }

    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/unassigned", authenticateToken, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id).populate("role");

    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    const requesterRole = requestingUser.role.rolename;

    const allowedRoles = ["superAdmin", "admin", "organization"];
    if (!allowedRoles.includes(requesterRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const unassignedUsers = await User.find({
      $or: [{ organization: { $exists: false } }, { organization: null }],
    }).populate("role", "rolename");

    res.json(unassignedUsers);
  } catch (err) {
    console.error("Fetch unassigned users error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { name, role, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isSelf = req.user.id === req.params.id;
    const isAdmin = ["admin", "superAdmin", "organization"].includes(
      req.user.role
    );

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

router.put("/assign-to-org/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUser = req.user;

    if (requestingUser.role !== "organization") {
      return res
        .status(403)
        .json({ message: "Only organizations can assign users" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const organizationId =
      typeof requestingUser.organization === "object"
        ? requestingUser.organization.id
        : requestingUser.organization;

    targetUser.organizations = targetUser.organizations || [];

    const alreadyAssigned = targetUser.organizations.some(
      (orgId) => orgId.toString() === organizationId.toString()
    );
    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "User already assigned to this organization" });
    }

    targetUser.organizations.push(organizationId);

    await targetUser.save();

    res.json({
      message: "User successfully assigned to organization",
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        organizations: targetUser.organizations,
      },
    });
  } catch (err) {
    console.error("Assign user to org error:", err);
    res.status(500).json({ message: "Internal server error" });
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
