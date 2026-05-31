const Chunk = require("../models/Chunk");
const askAI = require("../services/aiService");

const chatWithDocuments = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message required" });
    }

    // General questions — direct answer
    const generalQuestions = ["purpose", "what are you", "who are you", "what can you do", "help", "kya kar sakte", "tumhara kaam", "nexamind"];
    const isGeneral = generalQuestions.some(q => message.toLowerCase().includes(q));

    if (isGeneral) {
      return res.json({
        success: true,
        reply: `## Main NexaMind AI Study Assistant hoon! 🎓\n\n**Mera kaam:**\n- Aapke uploaded notes se questions ka jawab dena\n- PDF, DOCX, TXT files se padhai mein help karna\n- Hindi aur English dono mein samjhana\n\n**Kaise use karein:**\n1. Documents section mein apne notes upload karein\n2. Yahan koi bhi question puchein\n3. Main sirf aapke notes se jawab dunga 📚`,
        sources: [],
      });
    }

    // Chunks se data lo — userId field use karo
    const chunks = await Chunk.find({ userId: req.user.id });
    console.log("TOTAL CHUNKS:", chunks.length);

    if (!chunks || chunks.length === 0) {
      return res.json({
        success: true,
        reply: "Aapne abhi tak koi notes upload nahi kiye. Documents section mein PDF ya TXT upload karein! 📂",
        sources: [],
      });
    }

    // Full context build karo
    const fullContext = chunks
      .map(c => c.text || c.content || "")
      .filter(t => t.trim().length > 0)
      .join("\n\n");

    console.log("TOTAL CONTEXT LENGTH:", fullContext.length);

    // Keyword matching
 const cleanMessage =
  message
    .toLowerCase()
    .replace(/[^\w\s]/g, "");

const words =
  cleanMessage
    .split(" ")
    .filter(
      (w) =>
        w.trim().length > 2
    );

/* SPLIT INTO BETTER CHUNKS */

const paragraphs =
  fullContext
    .split(/[\n\r]+|\. /)
    .filter(
      (p) =>
        p.trim().length > 30
    );

/* SMART MATCHING */

let matched =
  paragraphs.filter(
    (para) => {
      const paraLower =
        para.toLowerCase();

      let score = 0;

      words.forEach(
        (word) => {
          if (
            paraLower.includes(
              word
            )
          ) {
            score++;
          }
        }
      );

      return score >= 1;
    }
  );

/* ARRAY SPECIAL CASE */

if (
  matched.length === 0 &&
  cleanMessage.includes(
    "array"
  )
) {
  matched =
    paragraphs.filter(
      (p) =>
        p
          .toLowerCase()
          .includes(
            "array"
          )
    );
}

/* SQL SPECIAL CASE */

if (
  matched.length === 0 &&
  cleanMessage.includes(
    "sql"
  )
) {
  matched =
    paragraphs.filter(
      (p) =>
        p
          .toLowerCase()
          .includes(
            "sql"
          ) ||
        p
          .toLowerCase()
          .includes(
            "database"
          )
    );
}

/* GIT SPECIAL CASE */

if (
  matched.length === 0 &&
  cleanMessage.includes(
    "git"
  )
) {
  matched =
    paragraphs.filter(
      (p) =>
        p
          .toLowerCase()
          .includes(
            "git"
          ) ||
        p
          .toLowerCase()
          .includes(
            "github"
          ) ||
        p
          .toLowerCase()
          .includes(
            "repository"
          )
    );
}

// Abhi bhi koi match nahi — topic notes mein nahi hai
if (matched.length === 0) {
  console.log(
    "NO MATCH FOUND"
  );

  matched =
    paragraphs.slice(
      0,
      15
    );
}

    // Agar koi match nahi — phir bhi top paragraphs bhejo
    if (matched.length === 0) {
      matched = paragraphs.slice(0, 40);
    }

    const context = matched.slice(0, 50).join("\n\n");
    console.log("MATCHED:", matched.length);
    console.log("PREVIEW:", context.substring(0, 200));

    const prompt = `Tu NexaMind AI Study Assistant hai.

STUDENT KE NOTES:
${context}

STUDENT KA SAWAAL: ${message}

BAHUT IMPORTANT RULES - ZAROOR FOLLOW KAR:
1. Sirf aur sirf notes mein se jawab de
2. Agar notes mein clearly likha hai tabhi answer de
3. Agar sawaal aur notes ka topic alag hai to SEEDHA bolo: "Yeh topic aapke notes mein nahi hai. Kripya relevant notes upload karein."
4. GALAT topic se answer BILKUL mat de — jaise string function puchha to Git commands mat batao
5. Hindi mein poocha to Hindi mein jawab de, English mein poocha to English mein
6. Clear headings aur bullet points use kar
7. Simple language use kar jo student samajh sake
8. Jawab sahi topic ka hai to end mein 2 follow-up questions suggest kar
9. Important terms **bold** karo
10. Agar confused ho topic ke baare mein to poochho mat — seedha "notes mein nahi hai" bolo`;

    const aiResponse = await askAI(prompt);

    const filenames = [...new Set(chunks.map(c => c.filename || c.source || "User Notes"))];

    return res.json({
      success: true,
      reply: aiResponse,
      sources: filenames,
      documentsUsed: filenames.length,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Chat failed: " + error.message,
      reply: "Error aaya. Backend check karein.",
    });
  }
};

module.exports = { chatWithDocuments };