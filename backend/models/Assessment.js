
const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sport: {
        type: String,
        required: true
    },

    speed: {
        type: Number,
        required: true
    },

    agility: {
        type: Number,
        required: true
    },

    endurance: {
        type: Number,
        required: true
    },

    coordination: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const Assessment = mongoose.model("Assessment", assessmentSchema);

module.exports = Assessment;
