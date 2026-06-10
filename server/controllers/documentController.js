const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");
const Chunk = require("../models/Chunk");
const chunkText = require("../services/chunkService");
const generateEmbedding = require("../services/embeddingService");

let Tesseract, fromPath;
try {
  Tesseract = require("tesseract.js");
  console.log("Tesseract loaded");
} catch (e) {
  console.log("Tesseract not available:", e.message);
}
try {
  fromPath = require("pdf2pic").fromPath;
  console.log("pdf2pic loaded");
} catch (e) {
  console.log("pdf2pic not available:", e.message);
}

const extractTextFromImage = async (imagePath) => {
  if (!Tesseract) throw new Error("Tesseract not installed");

  console.log("Running OCR on:", imagePath);
  const result = await Tesseract.recognize(imagePath, "eng+hin", {
    logger: (m) => {
      if (m.status === "recognizing text") {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  const text = result.data.text || "";
  console.log("OCR extracted chars:", text.length);
  console.log("OCR preview:", text.substring(0, 200));
  return text;
};

const uploadDocument = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const originalName = req.file.originalname;
    let extractedText = "";
    let extractionMethod = "";

    console.log(`\nProcessing: ${originalName} (${ext})`);

    if (ext === ".pdf") {
      try {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        extractedText = pdfData.text || "";
        extractionMethod = "pdf-parse";
        console.log("PDF text length:", extractedText.length);

        if (extractedText.trim().replace(/\s/g, "").length < 100) {
          console.log("PDF has little text, trying OCR...");

          if (fromPath) {
            const tempDir = path.join(__dirname, "../uploads/temp");
            if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

            const convert = fromPath(filePath, {
              density: 300,
              saveFilename: `ocr_${Date.now()}`,
              savePath: tempDir,
              format: "png",
              width: 2480,
              height: 3508,
            });

            let ocrText = "";
            for (let pageNum = 1; pageNum <= 3; pageNum++) {
              try {
                const page = await convert(pageNum);
                if (page && page.path) {
                  const pageText = await extractTextFromImage(page.path);
                  ocrText += pageText + "\n";
                  if (fs.existsSync(page.path)) fs.unlinkSync(page.path);
                }
              } catch (pageErr) {
                console.log(`Page ${pageNum} OCR error:`, pageErr.message);
                break;
              }
            }

            if (ocrText.trim().length > extractedText.trim().length) {
              extractedText = ocrText;
              extractionMethod = "tesseract-ocr-from-pdf";
            }
          }
        }
      } catch (pdfError) {
        console.log("PDF ERROR:", pdfError.message);

        if (Tesseract && fromPath) {
          try {
            extractedText = await extractTextFromImage(filePath);
            extractionMethod = "tesseract-direct";
          } catch (ocrErr) {
            console.log("Direct OCR also failed:", ocrErr.message);
          }
        }
      }
    } else if ([".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"].includes(ext)) {
      try {
        extractedText = await extractTextFromImage(filePath);
        extractionMethod = "tesseract-image";

        if (extractedText.trim().length < 20) {
          console.log("OCR result poor, raw text:", extractedText);
        }
      } catch (imgError) {
        console.log("IMAGE OCR ERROR:", imgError.message);
        extractedText = `[Image uploaded: ${originalName}. OCR extraction failed. Please ensure image is clear and well-lit.]`;
      }
    } else if ([".docx", ".doc"].includes(ext)) {
      try {
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value || "";
        extractionMethod = "mammoth";
      } catch (docErr) {
        console.log("DOCX ERROR:", docErr.message);
      }
    } else if (ext === ".txt") {
      extractedText = fs.readFileSync(filePath, "utf8");
      extractionMethod = "direct-read";
    } else if (ext === ".csv") {
      extractedText = fs.readFileSync(filePath, "utf8");
      extractionMethod = "csv-read";
    }

    if (!extractedText || extractedText.trim().length < 10) {
      extractedText = `File uploaded: ${originalName}. Text could not be extracted. File type: ${ext}. Please upload a PDF, DOCX, TXT, or clear image of notes.`;
    }

    console.log(`\nExtraction complete: ${extractionMethod}`);
    console.log("Total chars:", extractedText.length);
    console.log("Preview:", extractedText.substring(0, 300));

    const document = await Document.create({
      userId: req.user.id,
      user: req.user.id,
      title: originalName,
      filename: originalName,
      originalName,
      name: originalName,
      content: extractedText,
      extractedText,
      text: extractedText,
      type: ext,
      size: req.file.size,
      status: extractedText.length > 50 ? "Ready" : "Error",
      extractionMethod,
    });

    const chunks = chunkText(extractedText);
    console.log("Total chunks:", chunks.length);

    let chunksCreated = 0;
    for (const text of chunks) {
      try {
        const embedding = await generateEmbedding(text);
        await Chunk.create({
          userId: req.user.id,
          documentId: document._id,
          filename: originalName,
          source: originalName,
          text,
          embedding,
        });
        chunksCreated++;
      } catch (chunkError) {
        console.log("Chunk error:", chunkError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: `✅ "${originalName}" uploaded! Extracted ${extractedText.length} characters, created ${chunksCreated} searchable chunks. Method: ${extractionMethod}`,
      document,
      stats: {
        characters: extractedText.length,
        chunks: chunksCreated,
        method: extractionMethod,
      },
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Upload failed: " + error.message,
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      $or: [{ userId: req.user.id }, { user: req.user.id }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    await Document.findByIdAndDelete(id);
    await Chunk.deleteMany({ documentId: id });
    return res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { uploadDocument, getDocuments, deleteDocument };
