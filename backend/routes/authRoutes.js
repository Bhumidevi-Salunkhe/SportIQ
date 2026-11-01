
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");


// ======================================
// 1. REGISTER API
// ======================================

router.post("/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            role: "athlete"
        });

        await newUser.save();

        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ======================================
// 2. LOGIN API
// ======================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ======================================
// 3. SELECT SPORT API
// ======================================

router.put("/select-sport", verifyToken, async (req, res) => {
    try {
        const { sport } = req.body;

        const allowedSports = [
            "football",
            "cricket",
            "basketball",
            "athletics",
            "badminton",
            "volleyball"
        ];

        if (!sport || !allowedSports.includes(sport.toLowerCase())) {
            return res.status(400).json({
                message: "Please select a valid sport"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { sport: sport.toLowerCase() },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Sport selected successfully!",
            sport: updatedUser.sport
        });

    } catch (error) {
        res.status(500).json({
            message: "Sport selection failed",
            error: error.message
        });
    }
});


module.exports = router;
