import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Slider,
} from "@mui/material";
import { Quiz, CheckCircle, Cancel, Refresh } from "@mui/icons-material";
import api, { retryRequest } from "../api/axios";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [sourceDocs, setSourceDocs] = useState([]);

  const generateQuiz = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);

    try {
      const res = await retryRequest(() =>
        api.post("/api/quiz/generate", {
          topic: topic.trim() || undefined,
          count,
          difficulty,
        })
      );

      if (res.data.success) {
        setQuestions(res.data.questions);
        setSourceDocs(res.data.sourceDocs || []);
      } else {
        setError(res.data.message || "Quiz generation failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to generate quiz"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setError("");
  };

  const cardStyle = {
    bgcolor: "#0d0d18",
    border: "1px solid rgba(108,99,255,0.15)",
    borderRadius: "14px",
    p: 3,
    mb: 2,
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#fff", mb: 0.5 }}>
          📚 Quiz Mode
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
          AI generates quiz questions from your uploaded notes
        </Typography>
      </Box>

      {submitted && (
        <Box sx={{ ...cardStyle, border: "2px solid #6C63FF", mb: 3 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#fff", mb: 1 }}>
            Score: {score}/{questions.length} ({Math.round((score / questions.length) * 100)}%)
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(score / questions.length) * 100}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.1)",
              "& .MuiLinearProgress-bar": {
                bgcolor: score / questions.length >= 0.7 ? "#10B981" : "#EF4444",
              },
            }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Chip
              label={`✅ ${score} Correct`}
              sx={{ bgcolor: "rgba(16,185,129,0.2)", color: "#10B981" }}
            />
            <Chip
              label={`❌ ${questions.length - score} Wrong`}
              sx={{ bgcolor: "rgba(239,68,68,0.2)", color: "#EF4444" }}
            />
          </Box>
          <Button
            onClick={handleReset}
            startIcon={<Refresh />}
            sx={{ mt: 2, color: "#6C63FF", textTransform: "none" }}
          >
            Generate New Quiz
          </Button>
        </Box>
      )}

      {questions.length === 0 && (
        <Box sx={cardStyle}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#fff", mb: 3 }}>
            Quiz Settings
          </Typography>

          <TextField
            fullWidth
            label="Topic (optional)"
            placeholder="e.g. JavaScript, RAG, Git commands..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.04)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover fieldset": { borderColor: "#6C63FF" },
                "&.Mui-focused fieldset": { borderColor: "#6C63FF" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.4)" },
            }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13, mb: 1 }}>
              Number of Questions: {count}
            </Typography>
            <Slider
              value={count}
              onChange={(e, v) => setCount(v)}
              min={3}
              max={15}
              step={1}
              sx={{ color: "#6C63FF" }}
              marks={[
                { value: 3, label: "3" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 15, label: "15" },
              ]}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: "rgba(255,255,255,0.4)" }}>Difficulty</InputLabel>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              label="Difficulty"
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.04)",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6C63FF" },
                "& .MuiSvgIcon-root": { color: "#fff" },
              }}
            >
              <MenuItem value="easy">Easy — Basic definitions</MenuItem>
              <MenuItem value="medium">Medium — Application based</MenuItem>
              <MenuItem value="hard">Hard — Analysis & comparison</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                bgcolor: "rgba(239,68,68,0.1)",
                color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            onClick={generateQuiz}
            disabled={loading}
            fullWidth
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : (
                <Quiz />
              )
            }
            sx={{
              py: 1.5,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6C63FF, #8B5CF6)",
              fontSize: 15,
              fontWeight: 600,
              textTransform: "none",
              "&:disabled": { opacity: 0.6 },
            }}
          >
            {loading ? "Generating quiz from your notes..." : "Generate Quiz"}
          </Button>
        </Box>
      )}

      {sourceDocs.length > 0 && questions.length > 0 && (
        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
          <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Sources:</Typography>
          {sourceDocs.map((doc, i) => (
            <Chip
              key={i}
              label={`📄 ${doc}`}
              size="small"
              sx={{
                fontSize: 11,
                bgcolor: "rgba(108,99,255,0.1)",
                color: "#a09cff",
                border: "none",
              }}
            />
          ))}
        </Box>
      )}

      {questions.map((q, idx) => {
        const userAnswer = answers[q.id];
        const isAnswered = userAnswer !== undefined;
        const isCorrect = submitted && userAnswer === q.correct;
        const isWrong = submitted && isAnswered && userAnswer !== q.correct;

        return (
          <Box
            key={q.id}
            sx={{
              ...cardStyle,
              border: submitted
                ? isCorrect
                  ? "1px solid #10B981"
                  : isWrong
                    ? "1px solid #EF4444"
                    : "1px solid rgba(108,99,255,0.15)"
                : "1px solid rgba(108,99,255,0.15)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Typography
                sx={{ fontSize: 15, fontWeight: 600, color: "#fff", flex: 1, pr: 2 }}
              >
                {idx + 1}. {q.question}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                {q.topic && (
                  <Chip
                    label={q.topic}
                    size="small"
                    sx={{
                      fontSize: 10,
                      bgcolor: "rgba(108,99,255,0.1)",
                      color: "#a09cff",
                    }}
                  />
                )}
                {submitted && isCorrect && <CheckCircle sx={{ color: "#10B981" }} />}
                {submitted && isWrong && <Cancel sx={{ color: "#EF4444" }} />}
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {q.options.map((option, optIdx) => {
                let optionBg = "rgba(255,255,255,0.03)";
                let optionBorder = "rgba(255,255,255,0.08)";
                let optionColor = "rgba(255,255,255,0.7)";

                if (submitted) {
                  if (optIdx === q.correct) {
                    optionBg = "rgba(16,185,129,0.15)";
                    optionBorder = "#10B981";
                    optionColor = "#10B981";
                  } else if (optIdx === userAnswer && userAnswer !== q.correct) {
                    optionBg = "rgba(239,68,68,0.15)";
                    optionBorder = "#EF4444";
                    optionColor = "#EF4444";
                  }
                } else if (userAnswer === optIdx) {
                  optionBg = "rgba(108,99,255,0.15)";
                  optionBorder = "#6C63FF";
                  optionColor = "#c4c0ff";
                }

                return (
                  <Box
                    key={optIdx}
                    onClick={() => handleAnswer(q.id, optIdx)}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      cursor: submitted ? "default" : "pointer",
                      bgcolor: optionBg,
                      border: `1px solid ${optionBorder}`,
                      transition: "all 0.15s",
                      "&:hover": submitted
                        ? {}
                        : { bgcolor: "rgba(108,99,255,0.1)", borderColor: "#6C63FF" },
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: optionColor }}>
                      <strong>{["A", "B", "C", "D"][optIdx]}.</strong> {option}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {submitted && q.explanation && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  bgcolor: "rgba(108,99,255,0.08)",
                  borderRadius: "8px",
                  borderLeft: "3px solid #6C63FF",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                  <strong style={{ color: "#a09cff" }}>Explanation: </strong>
                  {q.explanation}
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}

      {questions.length > 0 && !submitted && (
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            mt: 2,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #10B981, #059669)",
            fontSize: 15,
            fontWeight: 600,
            textTransform: "none",
            "&:disabled": { opacity: 0.5 },
          }}
        >
          Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
        </Button>
      )}
    </Box>
  );
};

export default QuizPage;
