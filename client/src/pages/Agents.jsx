import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import SummaryRoundedIcon from "@mui/icons-material/SummarizeRounded";

const agents = [
  { name: "Research Agent", icon: <SearchRoundedIcon />, uses: 124, skills: ["Research", "Web", "RAG"] },
  { name: "Study Agent", icon: <EditNoteRoundedIcon />, uses: 98, skills: ["Flashcards", "Quiz", "Recall"] },
  { name: "Coding Agent", icon: <CodeRoundedIcon />, uses: 76, skills: ["Fixes", "Code", "Review"] },
  { name: "Summary Agent", icon: <SummaryRoundedIcon />, uses: 110, skills: ["Summarize", "Notes", "Meetings"] },
  { name: "Writing Agent", icon: <EditNoteRoundedIcon />, uses: 81, skills: ["Draft", "SEO", "Docs"] },
  { name: "Finance Agent", icon: <AttachMoneyRoundedIcon />, uses: 44, skills: ["Analyze", "Budget", "Report"] }
];

function Agents() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleLaunch = (agent) => {
    setSelected(agent);
    setOpen(true);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h4" fontWeight={900}>
            AI Agents
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)" }}>
            Launch task-specific agents for focused workflows.
          </Typography>
        </Box>

        <Button
          sx={{
            textTransform: "none",
            fontWeight: 800,
            color: "#fff",
            background: "linear-gradient(135deg, #6C63FF, #8B5CF6)"
          }}
        >
          Create Agent
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {agents.map((agent) => (
          <Grid item xs={12} sm={6} lg={4} key={agent.name}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: "100%" }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Avatar sx={{ bgcolor: "rgba(108,99,255,0.18)", color: "#c4c0ff" }}>{agent.icon}</Avatar>
                  <Chip label="Active" sx={{ bgcolor: "rgba(16,185,129,0.14)", color: "#10B981" }} />
                </Stack>

                <Box>
                  <Typography fontWeight={900} fontSize={22}>
                    {agent.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)" }}>
                    {agent.uses} uses this month
                  </Typography>
                </Box>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {agent.skills.map((skill) => (
                    <Chip key={skill} label={skill} size="small" sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#fff" }} />
                  ))}
                </Stack>

                <Button
                  onClick={() => handleLaunch(agent)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    color: "#fff",
                    background: "linear-gradient(135deg, #6C63FF, #8B5CF6)"
                  }}
                >
                  Launch
                </Button>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.name}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
            This agent is ready for task execution inside the NexaMind workspace.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Agents;