const { YoutubeTranscript } = require("youtube-transcript");

const getYoutubeTranscript = async (url) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript.map((item) => item.text).join(" ").trim();
  } catch (error) {
    console.log("YouTube transcript failed:", error.message);
    throw new Error("YouTube transcript failed");
  }
};

module.exports = getYoutubeTranscript;