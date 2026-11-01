
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Import routes and middleware
const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const assessmentRoutes = require("./routes/assessmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/assessments", assessmentRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to SportIQ Backend!");
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "SportIQ API is working successfully!"
    });
});

// Protected route
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "You have accessed a protected route!",
        user: req.user
    });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });

// Start server
app.listen(PORT, () => {
    console.log(`SportIQ server is running on port ${PORT}`);
});
