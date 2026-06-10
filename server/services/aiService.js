require("dotenv").config();
const axios = require("axios");

const MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "google/gemma-3-1b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
];

const callOpenRouter = async (messages, modelIndex = 0) => {
  if (modelIndex >= MODELS.length) {
    throw new Error("All AI models failed. Please try again later.");
  }

  const model = MODELS[modelIndex];
  console.log(`Trying model: ${model}`);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
        temperature: 0.3,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://nexamind-ai-qwog.vercel.app",
          "X-Title": "NexaMind Study Assistant",
        },
        timeout: 45000,
      }
    );

    const text =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      response.data?.choices?.[0]?.text?.trim();

    if (!text) {
      console.error("OpenRouter returned no text content:", JSON.stringify(response.data));
      throw new Error("Empty response");
    }

    console.log(`Success with model: ${model}`);
    return text;
  } catch (error) {
    const openRouterMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Unknown OpenRouter error";

    console.error(`Model ${model} failed:`, openRouterMessage);

    if (
      error.response?.status === 429 ||
      error.response?.status === 503 ||
      error.response?.status === 504 ||
      error.response?.status === 500 ||
      error.response?.status === 502 ||
      error.message.includes("Empty response") ||
      error.message.includes("timeout") ||
      error.message.includes("Network Error") ||
      error.code === "ECONNABORTED" ||
      error.code === "ECONNRESET"
    ) {
      console.log("Switching to next model...");
      return callOpenRouter(messages, modelIndex + 1);
    }

    throw new Error(openRouterMessage);
  }
};

const askAI = async (prompt, context = "") => {
  try {
    const messages = [
      {
        role: "system",
        content: `Tu NexaMind AI Study Assistant hai. Student ke uploaded notes se sawalo ka jawab de.

RULES:
1. Sirf notes mein se jawab de
2. Hindi mein poocha to Hindi mein jawab de, English mein to English mein
3. Clear headings aur bullet points use kar
4. Agar notes mein nahi hai to bolo: "Yeh topic aapke notes mein nahi hai"
5. Jawab ke baad 2 follow-up questions suggest kar
6. Important terms **bold** karo
7. General questions like "what is your purpose" ka jawab dena — tu NexaMind AI Study Assistant hai`,
      },
    ];

    if (context && context.trim().length > 50) {
      messages.push({
        role: "system",
        content: `STUDENT KE UPLOADED NOTES:\n${context.substring(0, 10000)}\n\nSirf inhi notes se jawab do.`,
      });
    } else {
      messages.push({
        role: "system",
        content: `Koi notes nahi mile. Student ko batao: "Koi notes upload nahi hain. Documents section mein PDF ya TXT upload karo."`,
      });
    }

    messages.push({ role: "user", content: prompt });

    return await callOpenRouter(messages);
  } catch (error) {
    console.error("AI FINAL ERROR:", error.message);
    throw new Error(error.message || "AI generation failed");
  }
};

module.exports = askAI;
