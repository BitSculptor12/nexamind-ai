const fs = require("fs");
const pdf = require("pdf-parse");

const extractPDFText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text || "";
  } catch (error) {
    console.log("PDF parsing failed:", error.message);
    throw new Error("PDF parsing failed");
  }
};

module.exports = extractPDFText;