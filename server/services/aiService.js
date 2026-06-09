require("dotenv").config();

const axios = require("axios");

const askAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-exp",

        messages: [
          {
            role: "system",
            content: "You are NexaMind AI Study Assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.3,
        max_tokens: 700,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",

          "HTTP-Referer":
            "https://nexamind-ai-qwog.vercel.app",

          "X-Title": "NexaMind",
        },
      }
    );

    console.log("AI SUCCESS");

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("\nAI ERROR:\n");

    console.log(
      error.response?.data || error.message
    );

    return `
# Answer Generated From Notes

Your uploaded notes contain information related to:

${prompt.substring(0, 400)}

But AI response generation failed.
Please check OpenRouter API key or model.
`;
  }
};

module.exports = askAI;