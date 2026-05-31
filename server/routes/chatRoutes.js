const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { chatWithDocuments } = require("../controllers/chatController");

router.post("/", authMiddleware, chatWithDocuments);
router.post("/ask", authMiddleware, chatWithDocuments);

router.get("/history", authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    history: []
  });
});

module.exports = router;