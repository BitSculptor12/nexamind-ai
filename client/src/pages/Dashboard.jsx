import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentsAPI } from "../api/documents";

function StatCard({ title, value, trend, icon, color, loading }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        bgcolor: "#0d0d18",
        border: "1px solid rgba(108,99,255,0.12)"
      }}
    >
      {loading ? (
        <>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton width="60%" sx={{ mt: 2 }} />
          <Skeleton width="40%" />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: `${color}18`,
              color
            }}
          >
            {icon}
          </Box>
          <Typography mt={2} fontSize={28} fontWeight={900}>
            {value}
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              {title}
            </Typography>
            <Chip
              size="small"
              label={trend}
              sx={{
                bgcolor: trend.startsWith("-") ? "rgba(239,68,68,0.14)" : "rgba(16,185,129,0.14)",
                color: trend.startsWith("-") ? "#F87171" : "#10B981",
                fontWeight: 800
              }}
            />
          </Stack>
        </>
      )}
    </Paper>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDocumentsAPI();
        const docs = data?.documents || data?.data || [];
        setDocumentCount(Array.isArray(docs) ? docs.length : 0);
      } catch {
        setDocumentCount(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const statCards = [
    { title: "Documents", value: documentCount || "0", trend: "+12", icon: <FolderOpenRoundedIcon />, color: "#6C63FF" },
    { title: "Chats", value: "48", trend: "+8", icon: <ChatRoundedIcon />, color: "#8B5CF6" },
    { title: "Tokens", value: "12.4k", trend: "-3", icon: <MemoryRoundedIcon />, color: "#06B6D4" },
    { title: "Nodes", value: "128", trend: "+15", icon: <HubRoundedIcon />, color: "#6366F1" },
    { title: "Contradictions", value: "3", trend: "-1", icon: <WarningAmberRoundedIcon />, color: "#F59E0B" },
    { title: "Progress", value: "89%", trend: "+5", icon: <SchoolRoundedIcon />, color: "#10B981" }
  ];

  const recentChats = [
    { title: "Research workflow review", time: "2m ago", source: "3 sources" },
    { title: "Login bug analysis", time: "1h ago", source: "2 sources" },
    { title: "Document upload summary", time: "4h ago", source: "5 sources" },
    { title: "Study mode flashcards", time: "Yesterday", source: "1 source" }
  ];

  const quickActions = [
    { label: "Upload", icon: <UploadFileRoundedIcon />, path: "/documents", color: "#6C63FF" },
    { label: "Chat", icon: <ChatRoundedIcon />, path: "/chat", color: "#8B5CF6" },
    { label: "Graph", icon: <AccountTreeRoundedIcon />, path: "/graph", color: "#06B6D4" },
    { label: "Quiz", icon: <QuizRoundedIcon />, path: "/study", color: "#10B981" }
  ];

  const recommendations = [
    "Run a contradiction scan on uploaded knowledge.",
    "Generate flashcards from your latest research notes.",
    "Connect new documents to your knowledge graph."
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          bgcolor: "#0d0d18",
          border: "1px solid rgba(108,99,255,0.12)",
          background:
            "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(6,182,212,0.06))"
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2}>
          <Box>
            <Typography fontSize={28} fontWeight={900}>
              {greeting}, {user?.name || "User"} 👋
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>{today}</Typography>
          </Box>

          <Button
            onClick={() => navigate("/chat")}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #6C63FF, #8B5CF6)"
            }}
          >
            New Chat
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={2.2}>
        {statCards.map((card) => (
          <Grid item xs={6} sm={4} md={2} key={card.title}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
            <Typography fontSize={20} fontWeight={800} mb={2}>
              Recent Conversations
            </Typography>

            <Stack spacing={1.4}>
              {recentChats.map((chat) => (
                <Box
                  key={chat.title}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }
                  }}
                  onClick={() => navigate("/chat")}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: "#6C63FF" }}>C</Avatar>
                      <Box>
                        <Typography fontWeight={700}>{chat.title}</Typography>
                        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.55)" }}>
                          {chat.time}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip size="small" label={chat.source} sx={{ bgcolor: "rgba(108,99,255,0.14)", color: "#c4c0ff", fontWeight: 700 }} />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
            <Typography fontSize={20} fontWeight={800} mb={2}>
              Quick Actions
            </Typography>

            <Grid container spacing={1.5}>
              {quickActions.map((action) => (
                <Grid item xs={6} key={action.label}>
                  <Button
                    onClick={() => navigate(action.path)}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      gap: 1.2,
                      py: 1.5,
                      px: 2,
                      borderRadius: 3,
                      textTransform: "none",
                      color: "#fff",
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.04)"
                    }}
                  >
                    <Box sx={{ color: action.color }}>{action.icon}</Box>
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Typography fontSize={20} fontWeight={800} mt={4} mb={2}>
              Knowledge Sources
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {["PDF (3)", "YouTube (1)", "URLs (5)", "GitHub (1)"].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    border: "1px solid rgba(108,99,255,0.12)"
                  }}
                />
              ))}
            </Stack>

            <Typography fontSize={20} fontWeight={800} mt={4} mb={2}>
              AI Recommendations
            </Typography>

            <Stack spacing={1.2}>
              {recommendations.map((item) => (
                <Button
                  key={item}
                  sx={{
                    justifyContent: "space-between",
                    textTransform: "none",
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.03)",
                    borderRadius: 3,
                    px: 2,
                    py: 1.4
                  }}
                >
                  <Typography textAlign="left" sx={{ color: "#fff" }}>
                    {item}
                  </Typography>
                  <ArrowForwardRoundedIcon />
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;