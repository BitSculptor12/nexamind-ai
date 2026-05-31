import { useMemo, useState } from "react";
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";

const nodes = [
  { id: 1, label: "RAG", type: "Concept", x: 160, y: 120 },
  { id: 2, label: "Embeddings", type: "Concept", x: 300, y: 90 },
  { id: 3, label: "PDF Guide", type: "File", x: 460, y: 140 },
  { id: 4, label: "OpenAI", type: "Entity", x: 650, y: 100 },
  { id: 5, label: "Vector DB", type: "Concept", x: 280, y: 250 },
  { id: 6, label: "Research", type: "Topic", x: 490, y: 260 },
  { id: 7, label: "Memory", type: "Topic", x: 700, y: 260 },
  { id: 8, label: "Study Mode", type: "Topic", x: 530, y: 390 },
  { id: 9, label: "Teams", type: "Entity", x: 230, y: 380 },
  { id: 10, label: "Chat", type: "Topic", x: 400, y: 420 }
];

const links = [
  [1, 2], [2, 3], [2, 5], [5, 6], [6, 7], [7, 8], [1, 9], [9, 10], [4, 1], [3, 10]
];

const colors = {
  Concept: "#6C63FF",
  File: "#06B6D4",
  Entity: "#10B981",
  Topic: "#8B5CF6"
};

function Graph() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(nodes[0]);

  const filtered = useMemo(() => {
    if (!search.trim()) return nodes;
    return nodes.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const connected = links
    .filter(([a, b]) => a === selected.id || b === selected.id)
    .map(([a, b]) => nodes.find((n) => n.id === (a === selected.id ? b : a)))
    .filter(Boolean);

  return (
    <Box>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Knowledge Graph
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)" }}>
            Visualize concepts, files, topics, and entities.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {["Concept", "File", "Entity", "Topic"].map((type) => (
            <Chip key={type} label={type} sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#fff" }} />
          ))}
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.04)",
              color: "#fff"
            }
          }}
        />
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 2 }}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: "calc(100vh - 220px)" }}>
          <svg width="100%" height="100%" viewBox="0 0 900 560">
            {links.map(([a, b], idx) => {
              const from = nodes.find((n) => n.id === a);
              const to = nodes.find((n) => n.id === b);
              return (
                <line
                  key={idx}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="2"
                />
              );
            })}

            {filtered.map((node) => (
              <g key={node.id} onClick={() => setSelected(node)} style={{ cursor: "pointer" }}>
                <circle cx={node.x} cy={node.y} r="22" fill={colors[node.type]} opacity="0.9" />
                <text x={node.x + 30} y={node.y + 5} fill="#fff" fontSize="16" fontWeight="700">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Typography fontWeight={900} fontSize={22}>
            Node Details
          </Typography>
          <Chip label={selected.type} sx={{ mt: 1, bgcolor: "rgba(108,99,255,0.14)", color: "#c4c0ff" }} />
          <Typography fontWeight={800} mt={2} fontSize={20}>
            {selected.label}
          </Typography>

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.62)", mt: 1.2 }}>
            This node is connected to your workspace knowledge graph.
          </Typography>

          <Typography fontWeight={900} mt={3} mb={1}>
            Connected Nodes
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {connected.map((n) => (
              <Chip key={n.id} label={n.label} sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#fff" }} />
            ))}
          </Stack>

          <Button
            fullWidth
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 800,
              color: "#fff",
              background: "linear-gradient(135deg, #6C63FF, #8B5CF6)"
            }}
          >
            Ask AI about this node
          </Button>

          <Box sx={{ mt: 3, p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
              Graph Stats
            </Typography>
            <Typography fontWeight={900} fontSize={22}>
              {nodes.length} nodes
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Graph;