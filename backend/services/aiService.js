const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

exports.generateStructuredPlan = async (idea) => {
  try {
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3-8b-instruct", // ✅ better model
      messages: [
        {
          role: "user",
          content: `
You are a product strategist AI.

Convert the idea into a HIGH-QUALITY structured plan.

STRICT RULES:
- Output ONLY valid JSON
- No explanation text outside JSON
- Be specific (NO generic phrases)
- Think like a real product builder

FORMAT:

{
  "goal": "clear and specific goal",
  "method": "how it works (technical + logic)",
  "steps": ["8-10 detailed steps"],
  "timeline": "If missing, say Not clearly defined + suggest timeline",
  "missing_elements": ["list of missing items"],
  "simplified": "one-line simple version",
  "action_steps": ["8-10 immediate next actions"]
}

USER IDEA:
"${idea}"
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let text = response.choices[0].message.content;

    console.log("🔍 RAW AI RESPONSE:\n", text);

    // 🧠 CLEAN RESPONSE
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");

      if (start === -1 || end === -1) {
        console.log("❌ JSON not found");
        return null;
      }

      const jsonString = text.slice(start, end + 1);

      const parsed = JSON.parse(jsonString);

      return parsed;

    } catch (err) {
      console.log("❌ JSON PARSE ERROR:", err.message);
      return null;
    }

  } catch (err) {
    console.log("❌ AI ERROR:", err.message);
    return null;
  }
};