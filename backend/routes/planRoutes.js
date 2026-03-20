const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");
const { generateStructuredPlan } = require("../services/aiService");

router.post("/analyze", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea required" });
    }

    let aiData = await generateStructuredPlan(idea);

    console.log("✅ AI DATA:", aiData);

    // ❗ If AI fails → return error (DO NOT silently fallback)
    if (!aiData) {
      return res.status(500).json({
        error: "AI failed to generate response. Check logs."
      });
    }

    // 🔧 Normalize arrays
    if (typeof aiData.steps === "string") {
      aiData.steps = aiData.steps.split("\n").filter(s => s.trim());
    }

    if (typeof aiData.action_steps === "string") {
      aiData.action_steps = aiData.action_steps.split("\n").filter(s => s.trim());
    }

    // 🧠 CLARITY SCORE (REALISTIC)
    let score = 0;

    if (aiData.goal && aiData.goal.length > 20) score += 25;
    if (aiData.steps && aiData.steps.length >= 6) score += 25;
    if (aiData.timeline && !aiData.timeline.includes("Not clearly defined")) score += 25;
    if (aiData.missing_elements && aiData.missing_elements.length < 3) score += 25;

    aiData.clarity_score = score;

    const newPlan = new Plan({
      idea,
      ...aiData,
    });

    await newPlan.save();

    res.json(newPlan);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔁 History
router.get("/history", async (req, res) => {
  const plans = await Plan.find().sort({ createdAt: -1 });
  res.json(plans);
});

module.exports = router;