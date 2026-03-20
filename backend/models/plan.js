const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  idea: String,
  goal: String,
  method: String,
  steps: [String],
  timeline: String,
  missing_elements: [String],
  simplified: String,
  action_steps: [String],
  clarity_score: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plan", PlanSchema);