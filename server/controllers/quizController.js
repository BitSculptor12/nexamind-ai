const Chunk = require("../models/Chunk");
const askAI = require("../services/aiService");

const generateQuiz = async (req, res) => {
  try {
    const { topic, count = 5, difficulty = "medium" } = req.body;
    const userId = req.user.id;

    const chunks = await Chunk.find({ userId });

    if (!chunks || chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No notes found. Please upload study material first.",
      });
    }

    let relevantChunks = chunks;
    if (topic) {
      const topicWords = topic.toLowerCase().split(" ").filter((w) => w.length > 1);
      relevantChunks = chunks.filter((chunk) => {
        const text = chunk.text.toLowerCase();
        return topicWords.some((word) => text.includes(word));
      });

      if (relevantChunks.length === 0) relevantChunks = chunks;
    }

    const context = relevantChunks
      .slice(0, 30)
      .map((c) => c.text)
      .join("\n\n");

    const prompt = `Generate exactly ${count} multiple choice quiz questions from these study notes.
    
Difficulty: ${difficulty}
${topic ? `Topic focus: ${topic}` : "Cover all topics in the notes"}

NOTES:
${context.substring(0, 8000)}

STRICT FORMAT - Return ONLY valid JSON array, nothing else:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct based on the notes",
    "topic": "Topic name"
  }
]

Rules:
- Generate exactly ${count} questions
- Each question must have exactly 4 options
- correct is the INDEX (0,1,2,3) of the correct option
- Questions must be based ONLY on the provided notes
- Mix question types: definition, application, comparison
- Return ONLY the JSON array, no other text`;

    const aiResponse = await askAI(prompt);

    let questions;
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON found in response");
      questions = JSON.parse(jsonMatch[0]);

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format");
      }

      questions = questions.map((q, i) => ({
        id: i + 1,
        question: q.question || "Question not generated",
        options: q.options || ["A", "B", "C", "D"],
        correct: typeof q.correct === "number" ? q.correct : 0,
        explanation: q.explanation || "See your notes for explanation",
        topic: q.topic || "General",
      }));
    } catch (parseError) {
      console.log("Quiz JSON parse error:", parseError.message);
      console.log("AI Response:", aiResponse.substring(0, 500));

      return res.status(500).json({
        success: false,
        message: "Quiz generation failed. Please try again.",
      });
    }

    return res.json({
      success: true,
      questions,
      total: questions.length,
      topic: topic || "All Topics",
      difficulty,
      sourceDocs: [...new Set(relevantChunks.map((c) => c.filename).filter(Boolean))],
    });
  } catch (error) {
    console.error("QUIZ ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Quiz generation failed: " + error.message,
    });
  }
};

module.exports = { generateQuiz };
