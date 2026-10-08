require("dotenv").config();
const axios = require("axios");

// Free models change often on OpenRouter. "openrouter/free" automatically picks
// a currently-working free model, so it goes first. You can override the whole
// list from Railway Variables with OPENROUTER_MODELS="model1,model2,model3".
const DEFAULT_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const MODELS = process.env.OPENROUTER_MODELS
  ? process.env.OPENROUTER_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
  : DEFAULT_MODELS;

// Errors where trying the next model makes sense
const RETRY_STATUSES = [400, 404, 408, 429, 500, 502, 503, 504];

const callOpenRouter = async (messages, modelIndex = 0, lastError = "") => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing. Add it in Railway > Variables.");
  }

  if (modelIndex >= MODELS.length) {
    throw new Error(
      lastError
        ? `All AI models failed. Last error: ${lastError}`
        : "All AI models failed. Please try again later."
    );
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
        timeout: 60000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error("Empty response");
    }

    console.log(`Success with model: ${model}`);
    return text;
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Unknown OpenRouter error";

    console.error(`Model ${model} failed (${status || error.code || "no status"}):`, message);

    // Key problems: no point trying other models
    if (status === 401) {
      throw new Error("OpenRouter API key is invalid or revoked. Create a new key and update OPENROUTER_API_KEY in Railway.");
    }
    if (status === 402) {
      throw new Error("OpenRouter credits/limit problem: " + message);
    }

    const shouldRetry =
      RETRY_STATUSES.includes(status) ||
      message.includes("Empty response") ||
      message.includes("timeout") ||
      message.includes("Network Error") ||
      error.code === "ECONNABORTED" ||
      error.code === "ECONNRESET";

    if (shouldRetry) {
      console.log("Switching to next model...");
      return callOpenRouter(messages, modelIndex + 1, `${model}: ${message}`);
    }

    throw new Error(message);
  }
};

const askAI = async (prompt, context = "") => {
  try {
    let systemPrompt = `Tu NexaMind AI Study Assistant hai. Student ke uploaded notes se sawalo ka jawab de.

RULES:
1. Sirf notes mein se jawab de
2. Hindi mein poocha to Hindi mein jawab de, English mein to English mein
3. Clear headings aur bullet points use kar
4. Agar notes mein nahi hai to bolo: "Yeh topic aapke notes mein nahi hai"
5. Jawab ke baad 2 follow-up questions suggest kar
6. Important terms **bold** karo
7. General questions like "what is your purpose" ka jawab dena — tu NexaMind AI Study Assistant hai`;

    if (context && context.trim().length > 50) {
      systemPrompt += `\n\nSTUDENT KE UPLOADED NOTES:\n${context.substring(0, 10000)}\n\nSirf inhi notes se jawab do.`;
    } else {
      systemPrompt += `\n\nKoi notes nahi mile. Student ko batao: "Koi notes upload nahi hain. Documents section mein PDF ya TXT upload karo."`;
    }

    // One single system message: some free models (e.g. Gemma) reject multiple system messages
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ];

    return await callOpenRouter(messages);
  } catch (error) {
    console.error("AI FINAL ERROR:", error.message);
    throw new Error(error.message || "AI generation failed");
  }
};

module.exports = askAI;
