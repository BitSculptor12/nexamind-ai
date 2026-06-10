const chunkText = (text, chunkSize = 600) => {
  if (!text || text.trim().length === 0) return [];

  const sentences = text.split(/[.!?\n]+/).filter((s) => s.trim().length > 20);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }

  if (current.trim().length > 20) chunks.push(current.trim());

  console.log(`Chunked into ${chunks.length} pieces`);
  return chunks;
};

module.exports = chunkText;
