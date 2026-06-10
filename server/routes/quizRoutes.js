const express = require("express");
const router = express.Router();
const { generateQuiz } = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/generate", authMiddleware, generateQuiz);

module.exports = router;
