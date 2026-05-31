require('dotenv').config();
const askGemini = require('./services/geminiService');
(async () => {
  try {
    const answer = await askGemini('Hello Gemini');
    console.log('ANSWER:', answer);
  } catch (err) {
    console.error('ERR:', err.message);
    if (err.response) console.error('RESP:', JSON.stringify(err.response.data, null, 2));
    console.error(err.stack);
    process.exitCode = 1;
  }
})();