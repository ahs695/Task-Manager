const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Role = require("./models/role");
const User = require("./models/user");
const Project = require("./routes/projectRoutes");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

const seedInitialData = async () => {
  const defaultRoles = ["superAdmin", "admin", "staff"];
  const roleMap = {};

  for (const rolename of defaultRoles) {
    let role = await Role.findOne({ rolename });
    if (!role) {
      role = await Role.create({ rolename });
      console.log(`Created role: ${rolename}`);
    }
    roleMap[rolename] = role;
  }

  const superAdminEmail = "superadmin@example.com";
  const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash("SuperSecret123", 10);
    await User.create({
      name: "Super Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: roleMap["superAdmin"]._id,
    });
    console.log("Default superAdmin user created");
  } else {
    console.log("SuperAdmin user already exists");
  }
};

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://hadi123:MbZGoTIm3lvy0ALt@cluster0.olwqopu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("MongoDB connected");
    await seedInitialData();
  })
  .catch((err) => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskAssignmentRoutes = require("./routes/taskAssignments");

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/task-assignments", taskAssignmentRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
