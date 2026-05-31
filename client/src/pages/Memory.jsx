import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Chip,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";

import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";

function Memory() {
  const [search, setSearch] = useState("");
  const [memoryText, setMemoryText] = useState("");
  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "RAG Architecture",
      content: "Retriever-Augmented Generation improves AI context retrieval.",
      category: "Research",
    },
    {
      id: 2,
      title: "Vector Embeddings",
      content: "Embeddings store semantic AI relationships.",
      category: "AI",
    },
    {
      id: 3,
      title: "MongoDB Notes",
      content: "MongoDB Atlas used for cloud database deployment.",
      category: "Database",
    },
  ]);

  const filteredMemories = useMemo(() => {
    return memories.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, memories]);

  const addMemory = () => {
    if (!memoryText.trim()) return;

    const newMemory = {
      id: Date.now(),
      title: "New Memory",
      content: memoryText,
      category: "General",
    };

    setMemories([newMemory, ...memories]);
    setMemoryText("");
  };

  const deleteMemory = (id) => {
    setMemories(memories.filter((item) => item.id !== id));
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h3" sx={{ color: "white", fontWeight: 800 }}>
            AI Memory Workspace
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mt: 1 }}>
            Store intelligent AI memory references
          </Typography>
        </Box>

        <Chip
          icon={<MemoryRoundedIcon />}
          label="MEMORY ENGINE ACTIVE"
          sx={{
            bgcolor: "rgba(108,99,255,0.15)",
            color: "#C4C0FF",
            fontWeight: 700,
          }}
        />
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 5,
          bgcolor: "#11111B",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Stack spacing={3}>
          <Typography sx={{ color: "white", fontWeight: 700, fontSize: 24 }}>
            Create New Memory
          </Typography>

          <TextField
            multiline
            rows={4}
            placeholder="Write AI memory notes..."
            value={memoryText}
            onChange={(e) => setMemoryText(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                borderRadius: 4,
                bgcolor: "#1A1A2B",
              },
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={addMemory}
            sx={{
              width: "fit-content",
              px: 4,
              py: 1.4,
              borderRadius: 3,
              background: "linear-gradient(135deg,#6C63FF,#9D4DFF)",
            }}
          >
            Save Memory
          </Button>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 4,
          bgcolor: "#11111B",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchRoundedIcon sx={{ color: "#9CA3AF" }} />
          <TextField
            variant="standard"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{ disableUnderline: true }}
            sx={{
              input: { color: "white" },
            }}
          />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {filteredMemories.map((memory) => (
          <Grid item xs={12} md={6} lg={4} key={memory.id}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 5,
                height: "100%",
                bgcolor: "#11111B",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={memory.category}
                    size="small"
                    sx={{
                      bgcolor: "rgba(108,99,255,0.15)",
                      color: "#C4C0FF",
                    }}
                  />
                  <IconButton
                    onClick={() => deleteMemory(memory.id)}
                    sx={{ color: "#FF5A5A" }}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </Stack>

                <Box>
                  <Typography sx={{ color: "white", fontWeight: 800, fontSize: 22, mb: 2 }}>
                    {memory.title}
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", lineHeight: 1.8 }}>
                    {memory.content}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PsychologyRoundedIcon sx={{ color: "#6C63FF" }} />
                    <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>AI Indexed</Typography>
                  </Stack>
                  <Chip
                    label="ACTIVE"
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,208,132,0.15)",
                      color: "#00D084",
                    }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Memory;