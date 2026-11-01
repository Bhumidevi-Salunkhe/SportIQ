const express = require("express");
const router = express.Router();

const Assessment = require("../models/Assessment");
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");


// ======================================
// 1. SUBMIT ASSESSMENT RESULTS
// ======================================

router.post("/submit", verifyToken, async (req, res) => {
    try {
        const { speed, agility, endurance, coordination } = req.body;

        // Check whether all results are provided
        if (
            speed === undefined ||
            agility === undefined ||
            endurance === undefined ||
            coordination === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all assessment results"
            });
        }

        // Check that all results are valid numbers
        const results = [speed, agility, endurance, coordination];

        if (results.some(value =>
            typeof value !== "number" || !Number.isFinite(value) || value < 0
        )) {
            return res.status(400).json({
                message: "Results must be valid non-negative numbers"
            });
        }

        // Find the logged-in student
        const user = await User.findById(req.user.id);

        if (!user || !user.sport) {
            return res.status(400).json({
                message: "Please select a sport first"
            });
        }

        // Save assessment in MongoDB
        const newAssessment = new Assessment({
            student: user._id,
            sport: user.sport,
            speed,
            agility,
            endurance,
            coordination
        });

        await newAssessment.save();

        res.status(201).json({
            message: "Assessment submitted successfully!",
            assessment: newAssessment
        });

    } catch (error) {
        res.status(500).json({
            message: "Assessment submission failed",
            error: error.message
        });
    }
});


// ======================================
// 2. VIEW PREVIOUS ASSESSMENT RESULTS
// ======================================

router.get("/my-results", verifyToken, async (req, res) => {
    try {
        const assessments = await Assessment.find({
            student: req.user.id
        }).sort({ createdAt: -1 });

        res.json({
            message: "Assessment results fetched successfully!",
            assessments
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch assessment results",
            error: error.message
        });
    }
});


module.exports = router;