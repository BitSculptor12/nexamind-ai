const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { fromPath } = require("pdf2pic");
const Document = require("../models/Document");
const Chunk = require("../models/Chunk");
const chunkText = require("../services/chunkService");
const generateEmbedding = require("../services/embeddingService");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const originalName = req.file.originalname;
    let extractedText = "";

    // PDF
    if (ext === ".pdf") {
      try {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text || "";
        console.log("PDF extracted length:", extractedText.length);

        // Handwritten PDF — OCR fallback
        if (extractedText.trim().length < 100) {
          console.log("Running OCR on handwritten PDF...");
          try {
            const tempDir = "./uploads/temp";
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

            const convert = fromPath(filePath, {
              density: 300,
              saveFilename: "page",
              savePath: tempDir,
              format: "png",
              width: 1600,
              height: 2000,
            });

            const page = await convert(1);

            // Hindi + English OCR
            const result = await Tesseract.recognize(page.path, "eng+hin", {
              logger: m => console.log("OCR:", m.status)
            });

            extractedText = result.data.text || "";
            console.log("OCR text length:", extractedText.length);

            // Cleanup temp file
            if (fs.existsSync(page.path)) fs.unlinkSync(page.path);
          } catch (ocrErr) {
            console.log("OCR ERROR:", ocrErr.message);
          }
        }
      } catch (pdfError) {
        console.log("PDF ERROR:", pdfError.message);
      }
    }

    // Image — handwritten notes
    else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      try {
        console.log("Running OCR on image...");
        // Hindi + English both
        const result = await Tesseract.recognize(filePath, "eng+hin", {
          logger: m => console.log("OCR:", m.status)
        });
        extractedText = result.data.text || "";
        console.log("IMAGE OCR LENGTH:", extractedText.length);
      } catch (imgError) {
        console.log("IMAGE OCR ERROR:", imgError.message);
      }
    }

    // TXT
    else if (ext === ".txt") {
      extractedText = fs.readFileSync(filePath, "utf8");
    }

    // DOCX
    else if (ext === ".docx") {
      try {
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || "";
      } catch (docErr) {
        console.log("DOCX ERROR:", docErr.message);
      }
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = "No readable text extracted from document.";
    }

    console.log("\nFINAL TEXT PREVIEW:\n", extractedText.substring(0, 300));

    // Save Document
    const document = await Document.create({
      userId: req.user.id,
      user: req.user.id,
      title: originalName,
      filename: originalName,
      originalName: originalName,
      name: originalName,
      content: extractedText,
      extractedText: extractedText,
      text: extractedText,
      type: ext,
      size: req.file.size,
      status: "Ready",
    });

    // Create Chunks — filename field bhi save karo
    const chunks = chunkText(extractedText);
    console.log("TOTAL CHUNKS:", chunks.length);

    for (const text of chunks) {
      try {
        const embedding = await generateEmbedding(text);
        await Chunk.create({
          userId: req.user.id,
          documentId: document._id,
          filename: originalName,   // YEH IMPORTANT HAI
          source: originalName,     // backup field
          text,
          embedding,
        });
      } catch (chunkError) {
        console.log("CHUNK ERROR:", chunkError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `✅ ${originalName} uploaded! Extracted ${extractedText.length} characters, created ${chunks.length} chunks.`,
      document,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Upload failed" });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [{ userId: req.user.id }, { user: req.user.id }]
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    console.log("GET DOCUMENTS ERROR:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

module.exports = { uploadDocument, getDocuments };