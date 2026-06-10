require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const corsOptions = require("./config/cors");
const { initializeAI } = require("./config/openai");
const keepAlive = require("./keepAlive");

const app = express();

console.log("\n🚀 Starting NexaMind AI Server.\n");

(async () => {
  try {
    await connectDB();
  } catch (error) {
    console.warn("⚠️ DB initialization skipped:", error.message);
  }

  try {
    initializeAI();
  } catch (error) {
    console.warn("⚠️ AI initialization failed:", error.message);
  }

  console.log("\n✅ Server ready for requests\n");
})();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
// app.use("/api/payment", require("./routes/paymentRoutes"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API running",
  });
});

const clientDist = path.join(__dirname, "..", "client", "dist");
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(express.static(clientDist));

  app.get(/^\/(?!api).*/, (req, res, next) => {
    res.sendFile(path.join(clientDist, "index.html"), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "API running",
    });
  });
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n📡 Server running on http://localhost:${PORT}\n`);
  keepAlive();
});