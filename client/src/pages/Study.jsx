import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material";

const flashcards = [
  { front: "What is RAG?", back: "Retriever-Augmented Generation combines retrieval with generation." },
  { front: "What is embedding?", back: "A vector representation of semantic meaning." },
  { front: "What is cosine similarity?", back: "A measure of angle between two vectors." },
  { front: "Why use a knowledge graph?", back: "To visualize relationships between concepts." },
  { front: "What is chunking?", back: "Splitting content into smaller retrievable pieces." }
];

function Study() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [topic, setTopic] = useState("AI");
  const [difficulty, setDifficulty] = useState(3);

  const streak = 12;
  const progress = ((index + 1) / flashcards.length) * 100;

  const card = flashcards[index];

  const next = () => {
    setShowAnswer(false);
    setIndex((prev) => Math.min(prev + 1, flashcards.length - 1));
  };

  const prev = () => {
    setShowAnswer(false);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "280px 1fr 240px", gap: 2 }}>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
        <Typography fontWeight={900} mb={2}>
          Source List
        </Typography>
        <Stack spacing={1}>
          {["RAG Guide", "Embeddings Notes", "Research Paper"].map((item) => (
            <Chip key={item} label={item} sx={{ justifyContent: "flex-start", bgcolor: "rgba(255,255,255,0.04)", color: "#fff" }} />
          ))}
        </Stack>

        <Typography fontWeight={900} mt={3} mb={1}>
          Quiz Settings
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
          Difficulty
        </Typography>
        <Slider value={difficulty} min={1} max={5} onChange={(_, v) => setDifficulty(v)} sx={{ color: "#6C63FF" }} />
        <TextField
          fullWidth
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          sx={{ mt: 1, "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" } }}
        />
      </Paper>

      <Box>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontWeight={900} fontSize={22}>
                Study Mode
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
                Topic: {topic}
              </Typography>
            </Box>
            <Chip label={`🔥 Streak ${streak}`} sx={{ bgcolor: "rgba(16,185,129,0.14)", color: "#10B981", fontWeight: 800 }} />
          </Stack>
          <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, borderRadius: 999, height: 10 }} />
        </Paper>

        <Box
          sx={{
            mt: 2,
            perspective: "1200px"
          }}
        >
          <Box
            sx={{
              position: "relative",
              minHeight: 340,
              transformStyle: "preserve-3d",
              transition: "transform 0.6s",
              transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)"
            }}
          >
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                borderRadius: 4,
                bgcolor: "#0d0d18",
                border: "1px solid rgba(108,99,255,0.12)",
                p: 4,
                display: "grid",
                placeItems: "center"
              }}
            >
              <Typography fontSize={14} sx={{ color: "rgba(255,255,255,0.55)" }}>
                Question
              </Typography>
              <Typography fontSize={30} fontWeight={900} textAlign="center" mt={1}>
                {card.front}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                borderRadius: 4,
                bgcolor: "#0d0d18",
                border: "1px solid rgba(108,99,255,0.12)",
                p: 4,
                display: "grid",
                placeItems: "center"
              }}
            >
              <Typography fontSize={14} sx={{ color: "rgba(255,255,255,0.55)" }}>
                Answer
              </Typography>
              <Typography fontSize={24} fontWeight={800} textAlign="center" mt={1}>
                {card.back}
              </Typography>
            </Paper>
          </Box>
        </Box>

        <Stack direction="row" justifyContent="center" spacing={1.5} mt={3}>
          <Button onClick={prev} sx={{ textTransform: "none", color: "#fff", bgcolor: "rgba(255,255,255,0.04)" }}>
            Previous
          </Button>
          <Button onClick={() => setShowAnswer((s) => !s)} sx={{ textTransform: "none", color: "#fff", bgcolor: "linear-gradient(135deg, #6C63FF, #8B5CF6)", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}>
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </Button>
          <Button onClick={next} sx={{ textTransform: "none", color: "#fff", bgcolor: "rgba(255,255,255,0.04)" }}>
            Next
          </Button>
        </Stack>

        <Stack direction="row" justifyContent="center" spacing={1.5} mt={2}>
          <Chip label="Got it" sx={{ bgcolor: "rgba(16,185,129,0.14)", color: "#10B981" }} />
          <Chip label="Revisit" sx={{ bgcolor: "rgba(245,158,11,0.14)", color: "#F59E0B" }} />
          <Chip label="Hard" sx={{ bgcolor: "rgba(239,68,68,0.14)", color: "#EF4444" }} />
        </Stack>
      </Box>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
        <Typography fontWeight={900} mb={2}>
          Session Stats
        </Typography>
        <Stack spacing={1.5}>
          {[
            ["Cards", "5/20"],
            ["Accuracy", "88%"],
            ["Mastery", "74%"],
            ["Weak Topics", "2"]
          ].map(([a, b]) => (
            <Box key={a} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
                {a}
              </Typography>
              <Typography fontWeight={800}>{b}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

export default Study;