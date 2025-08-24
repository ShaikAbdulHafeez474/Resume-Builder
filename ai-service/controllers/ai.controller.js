
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function callGemini(prompt) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Failed to call Gemini API");
  }
}

exports.improveSummary = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing input text" });

  try {
    const improved = await callGemini(
      `Improve the following resume summary for clarity, conciseness, and professionalism:\n\n${text}`
    );
    res.json({ improved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateSkills = async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: "Missing role" });

  try {
    const skills = await callGemini(
      `Suggest a list of relevant, industry-standard skills for the role: ${role}. 
       Provide the response as a comma-separated list.`
    );
    res.json({ skills: skills.split(",").map(s => s.trim()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
