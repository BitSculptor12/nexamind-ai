const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../services/multerService");

const {
  uploadDocument,
  getDocuments
} = require("../controllers/documentController");

router.get("/", authMiddleware, getDocuments);

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

module.exports = router;