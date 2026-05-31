import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const conflicts = [
  {
    severity: "High",
    color: "#EF4444",
    title: "React Virtual DOM vs Direct DOM manipulation",
    left: "React prefers declarative rendering via the virtual DOM.",
    right: "Direct DOM manipulation can break React's state model.",
    analysis: "These statements are compatible in most contexts, but direct DOM manipulation should be minimized in React."
  },
  {
    severity: "Medium",
    color: "#F59E0B",
    title: "MongoDB schema-less vs Mongoose schemas",
    left: "MongoDB is schema-less by default.",
    right: "Mongoose introduces structure and validation.",
    analysis: "Both are true; Mongoose adds schema discipline on top of MongoDB."
  },
  {
    severity: "Low",
    color: "#10B981",
    title: "LLM context window size",
    left: "Older models had smaller windows.",
    right: "Newer models can support far larger windows.",
    analysis: "Context window varies by model version, so the statement depends on the specific model."
  }
];

function Contradictions() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Contradiction Detector
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)" }}>
            Scan your knowledge base for conflicts and gaps.
          </Typography>
        </Box>

        <Button sx={{ textTransform: "none", fontWeight: 800, color: "#fff", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}>
          Rescan
        </Button>
      </Stack>

      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
        Last scanned: just now
      </Typography>

      <Stack direction="row" spacing={1.5} mt={2} mb={2} flexWrap="wrap">
        <Chip label="High: 1" sx={{ bgcolor: "rgba(239,68,68,0.14)", color: "#EF4444" }} />
        <Chip label="Medium: 2" sx={{ bgcolor: "rgba(245,158,11,0.14)", color: "#F59E0B" }} />
        <Chip label="Resolved: 5" sx={{ bgcolor: "rgba(16,185,129,0.14)", color: "#10B981" }} />
      </Stack>

      <Stack spacing={2}>
        {conflicts.map((item, idx) => {
          const open = openIndex === idx;
          return (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: "#0d0d18",
                border: `1px solid rgba(108,99,255,0.12)`,
                borderLeft: `4px solid ${item.color}`
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={() => setOpenIndex(open ? -1 : idx)} sx={{ cursor: "pointer" }}>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningAmberRoundedIcon sx={{ color: item.color }} />
                    <Chip size="small" label={item.severity} sx={{ bgcolor: `${item.color}22`, color: item.color }} />
                  </Stack>
                  <Typography fontWeight={900} mt={1}>
                    {item.title}
                  </Typography>
                </Box>

                <IconToggle open={open} />
              </Stack>

              <Collapse in={open}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={2}>
                  <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Source A
                    </Typography>
                    <Typography mt={1}>{item.left}</Typography>
                  </Box>

                  <Box sx={{ display: "grid", placeItems: "center", px: 1 }}>
                    <Typography fontWeight={900} sx={{ color: "rgba(255,255,255,0.45)" }}>
                      VS
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1, p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Source B
                    </Typography>
                    <Typography mt={1}>{item.right}</Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2, p: 2, borderRadius: 3, bgcolor: "rgba(108,99,255,0.08)" }}>
                  <Typography fontWeight={800} mb={1}>
                    AI Analysis
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>{item.analysis}</Typography>
                </Box>

                <Stack direction="row" spacing={1.5} mt={2}>
                  <Button sx={{ textTransform: "none", color: "#fff", bgcolor: "rgba(16,185,129,0.14)" }}>
                    Mark Resolved
                  </Button>
                  <Button sx={{ textTransform: "none", color: "#fff", bgcolor: "rgba(255,255,255,0.04)" }}>
                    View in Chat
                  </Button>
                </Stack>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}

function IconToggle({ open }) {
  return (
    <Box sx={{ color: "#fff", display: "grid", placeItems: "center" }}>
      <ExpandMoreRoundedIcon sx={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
    </Box>
  );
}

export default Contradictions;