const axios = require("axios");
const cheerio = require("cheerio");

const scrapeWebsite = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(response.data);
    const text = $("body").text().replace(/\s+/g, " ").trim();

    return text || "";
  } catch (error) {
    console.log("URL scrape failed:", error.message);
    throw new Error("Website scraping failed");
  }
};

module.exports = scrapeWebsite;