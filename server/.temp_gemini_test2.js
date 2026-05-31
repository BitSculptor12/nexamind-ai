require('dotenv').config();
const axios = require('axios');
const key = process.env.GEMINI_API_KEY;
const tests = [
  {
    url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=' + key,
    body: { content: [{ type: 'text', text: 'Hello Gemini' }] }
  },
  {
    url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=' + key,
    body: { text: 'Hello Gemini' }
  },
  {
    url: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=' + key,
    body: { content: [ { type: 'text', text: 'Hello Gemini' } ], temperature: 0.2 }
  }
];
(async () => {
  for (const test of tests) {
    try {
      const res = await axios.post(test.url, test.body, { validateStatus: () => true });
      console.log('URL:', test.url);
      console.log('STATUS:', res.status);
      console.log('DATA:', JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('ERROR URL:', test.url);
      console.error('ERR MSG:', err.message);
      if (err.response) {
        console.error('STATUS:', err.response.status);
        console.error('DATA:', JSON.stringify(err.response.data, null, 2));
      }
    }
    console.log('-------------------------');
  }
})();