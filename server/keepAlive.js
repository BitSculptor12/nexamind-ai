const https = require("https");

const keepAlive = () => {
  const url = process.env.RENDER_URL || "https://nexamind-ai-a29k.onrender.com";
  setInterval(() => {
    https.get(url, (res) => {
      console.log(`Keep-alive ping: ${res.statusCode}`);
    }).on("error", (err) => {
      console.log("Keep-alive error:", err.message);
    });
  }, 14 * 60 * 1000);
};

module.exports = keepAlive;
