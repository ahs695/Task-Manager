const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://hadi123:MbZGoTIm3lvy0ALt@cluster0.olwqopu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Import and use the auth routes
const authRoutes = require("./routes/auth"); // adjust the path if needed
app.use("/api/auth", authRoutes); // <-- prefixing all routes in auth.js with /api/auth

// Routes
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
