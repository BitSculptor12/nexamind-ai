
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentsAPI } from "../api/documents";

const colors = {
  purple: "#8B7CFF",
  cyan: "#22D3EE",
  green: "#34D399",
  amber: "#FBBF24",
  text: "#F4F4FC",
  muted: "#9CA3B8",
  panel: "#10111F",
  border: "rgba(148, 163, 255, 0.13)"
};

const panelSx = {
  p: { xs: 2, sm: 2.75 },
  borderRadius: 3,
  bgcolor: colors.panel,
  color: colors.text,
  border: `1px solid ${colors.border}`,
  backgroundImage: "none",
  minWidth: 0
};

function StatCard({ title, value, icon, color, loading, subtitle, onClick }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      sx={{
        ...panelSx,
        p: 2.25,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 180ms, transform 180ms",
        "&:hover": onClick ? {
          borderColor: `${color}80`,
          transform: "translateY(-3px)"
        } : {},
        "&:focus-visible": {
          outline: `2px solid ${color}`,
          outlineOffset: 2
        }
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            bgcolor: `${color}18`,
            color
          }}
        >
          {icon}
        </Box>
        {onClick && (
          <ArrowForwardRoundedIcon
            sx={{ fontSize: 18, color: colors.muted }}
          />
        )}
      </Stack>

      {loading ? (
        <>
          <Skeleton width="48%" sx={{ mt: 2 }} />
          <Skeleton width="70%" />
        </>
      ) : (
        <>
          <Typography
            sx={{
              mt: 2,
              fontSize: 29,
              fontWeight: 800,
              letterSpacing: "-0.8px"
            }}
          >
            {value}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 600, mt: 0.4 }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: colors.muted, mt: 0.5 }}
          >
            {subtitle}
          </Typography>
        </>
      )}
    </Paper>
  );
}

function ActionCard({ title, description, icon, color, onClick }) {
  return (
    <Button
      onClick={onClick}
      fullWidth
      sx={{
        height: "100%",
        minHeight: 105,
        p: 1.75,
        borderRadius: 2.5,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "column",
        gap: 1,
        textAlign: "left",
        textTransform: "none",
        color: colors.text,
        border: `1px solid ${colors.border}`,
        bgcolor: "rgba(255,255,255,0.018)",
        "&:hover": {
          bgcolor: `${color}12`,
          borderColor: `${color}70`
        }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ color, display: "flex" }}>{icon}</Box>
        <Typography fontWeight={700}>{title}</Typography>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          color: colors.muted,
          whiteSpace: "normal",
          lineHeight: 1.5
        }}
      >
        {description}
      </Typography>
    </Button>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [documentCount, setDocumentCount] = useState(null);
  const [error, setError] = useState("");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }),
    []
  );

  const loadDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDocumentsAPI();
      const docs = data?.documents ?? data?.data;

      if (Array.isArray(docs)) {
        setDocumentCount(docs.length);
      } else {
        setDocumentCount(null);
        setError("Could not read document statistics.");
      }
    } catch {
      setDocumentCount(null);
      setError("Documents could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const stats = [
    {
      title: "Documents",
      value: documentCount ?? "—",
      subtitle: "Your uploaded knowledge",
      icon: <FolderOpenRoundedIcon />,
      color: colors.purple,
      onClick: () => navigate("/documents")
    },
    {
      title: "AI Chat",
      value: "Explore",
      subtitle: "Ask questions and learn",
      icon: <ChatRoundedIcon />,
      color: "#A78BFA",
      onClick: () => navigate("/chat")
    },
    {
      title: "Knowledge Graph",
      value: "Explore",
      subtitle: "Discover connections",
      icon: <HubRoundedIcon />,
      color: colors.cyan,
      onClick: () => navigate("/graph")
    },
    {
      title: "Study Mode",
      value: "Learn",
      subtitle: "Revise your knowledge",
      icon: <SchoolRoundedIcon />,
      color: colors.green,
      onClick: () => navigate("/study")
    }
  ];

  const actions = [
    {
      title: "Upload documents",
      description: "Add PDFs and learning materials",
      icon: <UploadFileRoundedIcon />,
      color: colors.purple,
      path: "/documents"
    },
    {
      title: "Start a conversation",
      description: "Get answers from your knowledge",
      icon: <ChatRoundedIcon />,
      color: "#A78BFA",
      path: "/chat"
    },
    {
      title: "Explore knowledge graph",
      description: "View connected concepts",
      icon: <AccountTreeRoundedIcon />,
      color: colors.cyan,
      path: "/graph"
    },
    {
      title: "Practice and revise",
      description: "Open your study workspace",
      icon: <QuizRoundedIcon />,
      color: colors.green,
      path: "/study"
    },
    {
      title: "Research a topic",
      description: "Open your AI research workspace",
      icon: <SearchRoundedIcon />,
      color: colors.amber,
      path: "/research"
    },
    {
      title: "Check contradictions",
      description: "Review potential knowledge conflicts",
      icon: <WarningAmberRoundedIcon />,
      color: "#FB7185",
      path: "/contradictions"
    }
  ];

  return (
    <Box sx={{ width: "100%", pb: 4, color: colors.text }}>
      {/* Welcome banner */}
      <Paper
        elevation={0}
        sx={{
          ...panelSx,
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          overflow: "hidden",
          position: "relative",
          background:
            "radial-gradient(ellipse at 85% 15%, rgba(139,124,255,0.20), transparent 45%), linear-gradient(120deg, #14152A, #10111F 75%)"
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2.5}
        >
          <Box sx={{ minWidth: 0 }}>
            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label="YOUR AI WORKSPACE"
              size="small"
              sx={{
                mb: 2,
                color: colors.purple,
                bgcolor: "rgba(139,124,255,0.12)",
                fontWeight: 700,
                letterSpacing: 0.7,
                "& .MuiChip-icon": { color: colors.purple }
              }}
            />
            <Typography
              sx={{
                fontSize: { xs: 25, sm: 32 },
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.25,
                overflowWrap: "anywhere"
              }}
            >
              {greeting}, {user?.name || "there"} 👋
            </Typography>
            <Typography sx={{ mt: 1, color: colors.muted }}>
              {today}
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 540,
                lineHeight: 1.7,
                color: "#C1C4D6",
                fontSize: 14
              }}
            >
              Your knowledge, connected. Upload your notes, explore ideas
              and get more from what you learn.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<ChatRoundedIcon />}
            onClick={() => navigate("/chat")}
            sx={{
              flexShrink: 0,
              px: 2.5,
              py: 1.4,
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: colors.purple,
              color: "#fff",
              boxShadow: "0 8px 24px rgba(139,124,255,0.20)",
              "&:hover": { bgcolor: "#7868F5" }
            }}
          >
            Start a new chat
          </Button>
        </Stack>
      </Paper>

      {/* Workspace overview */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.75 }}
      >
        <Box>
          <Typography fontSize={19} fontWeight={800}>
            Workspace overview
          </Typography>
          <Typography fontSize={13} sx={{ color: colors.muted, mt: 0.5 }}>
            Your tools at a glance
          </Typography>
        </Box>

        <Button
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={loadDocuments}
          disabled={loading}
          sx={{ textTransform: "none", color: colors.purple }}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="warning"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={loadDocuments}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard {...stat} loading={loading && stat.title === "Documents"} />
          </Grid>
        ))}
      </Grid>

      {/* Quick actions */}
      <Box sx={{ mt: 4 }}>
        <Typography fontSize={20} fontWeight={800}>
          Quick actions
        </Typography>
        <Typography
          sx={{ color: colors.muted, fontSize: 13, mt: 0.5, mb: 2 }}
        >
          Pick up where you want to work
        </Typography>

        <Grid container spacing={1.75}>
          {actions.map((action) => (
            <Grid item xs={12} sm={6} lg={4} key={action.title}>
              <ActionCard
                {...action}
                onClick={() => navigate(action.path)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Knowledge workspace */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ ...panelSx, height: "100%" }}>
            <Stack direction="row" alignItems="center" gap={1.25} mb={1}>
              <FolderOpenRoundedIcon sx={{ color: colors.purple }} />
              <Typography fontSize={18} fontWeight={800}>
                Your knowledge library
              </Typography>
            </Stack>

            <Typography
              sx={{ fontSize: 13, color: colors.muted, lineHeight: 1.7 }}
            >
              Your uploaded documents are the foundation of your AI
              workspace. Open your library to manage files and continue
              learning from your materials.
            </Typography>

            <Divider sx={{ my: 2, borderColor: colors.border }} />

            {loading ? (
              <Skeleton width="65%" />
            ) : documentCount === null ? (
              <Typography fontSize={14} color="text.secondary">
                Document count is currently unavailable.
              </Typography>
            ) : documentCount === 0 ? (
              <Box sx={{ py: 1 }}>
                <Typography fontWeight={700}>
                  Your library is ready for its first document.
                </Typography>
                <Typography
                  sx={{ color: colors.muted, fontSize: 13, mt: 0.75 }}
                >
                  Upload your notes or study materials to get started.
                </Typography>
              </Box>
            ) : (
              <Typography fontSize={14}>
                You have{" "}
                <Box component="span" sx={{ color: colors.cyan, fontWeight: 800 }}>
                  {documentCount} {documentCount === 1 ? "document" : "documents"}
                </Box>{" "}
                in your workspace.
              </Typography>
            )}

            <Button
              onClick={() => navigate("/documents")}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 700,
                color: colors.purple
              }}
            >
              Open documents
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ ...panelSx, height: "100%" }}>
            <Stack direction="row" alignItems="center" gap={1.25} mb={1}>
              <AutoAwesomeRoundedIcon sx={{ color: colors.cyan }} />
              <Typography fontSize={18} fontWeight={800}>
                Suggested next steps
              </Typography>
            </Stack>

            <Typography
              sx={{ color: colors.muted, fontSize: 13, mb: 2, lineHeight: 1.7 }}
            >
              Choose a task to continue. Suggestions are navigation shortcuts,
              not claims that an AI task has already run.
            </Typography>

            {[
              {
                title: "Ask questions about your notes",
                path: "/chat"
              },
              {
                title: "Explore connected concepts",
                path: "/graph"
              },
              {
                title: "Start a research session",
                path: "/research"
              }
            ].map((item) => (
              <Button
                key={item.title}
                fullWidth
                onClick={() => navigate(item.path)}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  justifyContent: "space-between",
                  textAlign: "left",
                  textTransform: "none",
                  color: colors.text,
                  borderRadius: 2,
                  px: 1.5,
                  py: 1.3,
                  mb: 1,
                  bgcolor: "rgba(255,255,255,0.025)",
                  "&:hover": {
                    bgcolor: "rgba(139,124,255,0.10)"
                  }
                }}
              >
                {item.title}
              </Button>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
