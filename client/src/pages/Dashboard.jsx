from pathlib import Path

code = r'''import { useCallback, useEffect, useMemo, useState } from "react";
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
  Typography,
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
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentsAPI } from "../api/documents";

const C = {
  bg: "#090A12",
  panel: "#10111C",
  panelHover: "#151627",
  border: "rgba(160, 160, 210, 0.13)",
  borderHover: "rgba(150, 130, 255, 0.45)",
  text: "#F5F5FA",
  muted: "#A1A3B8",
  soft: "#777B95",
  purple: "#8B7CFF",
  violet: "#B29BFF",
  cyan: "#32D4E8",
  green: "#36D6A0",
  amber: "#F5B84B",
  rose: "#FB7185",
};

const panelSx = {
  bgcolor: C.panel,
  color: C.text,
  border: `1px solid ${C.border}`,
  borderRadius: "16px",
  backgroundImage: "none",
  boxShadow: "0 8px 28px rgba(0,0,0,0.10)",
  minWidth: 0,
};

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={1.25}
      sx={{ mb: 2 }}
    >
      <Box>
        {eyebrow && (
          <Typography
            sx={{
              color: C.purple,
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              mb: 0.65,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          sx={{
            color: C.text,
            fontSize: { xs: 17, sm: 19 },
            fontWeight: 750,
            letterSpacing: "-0.35px",
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: C.muted, fontSize: 12.5, mt: 0.55 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}

function StatCard({ title, value, subtitle, icon, color, loading, onClick }) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={{
        ...panelSx,
        p: { xs: 1.8, sm: 2 },
        minHeight: 150,
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 160ms ease, background-color 160ms ease, transform 160ms ease",
        "&:hover": onClick
          ? {
              borderColor: `${color}75`,
              bgcolor: C.panelHover,
              transform: "translateY(-2px)",
            }
          : {},
        "&:focus-visible": {
          outline: `2px solid ${color}`,
          outlineOffset: 2,
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "11px",
            display: "grid",
            placeItems: "center",
            bgcolor: `${color}17`,
            color,
            "& svg": { fontSize: 21 },
          }}
        >
          {icon}
        </Box>
        {onClick && (
          <ArrowForwardRoundedIcon sx={{ fontSize: 17, color: C.soft }} />
        )}
      </Stack>

      {loading ? (
        <Box sx={{ mt: 2 }}>
          <Skeleton width="48%" height={31} />
          <Skeleton width="72%" height={19} />
        </Box>
      ) : (
        <Box sx={{ mt: "auto", pt: 1.7 }}>
          <Typography
            sx={{
              fontSize: typeof value === "number" ? 26 : 19,
              lineHeight: 1.25,
              fontWeight: 800,
              letterSpacing: "-0.55px",
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.55 }}>
            {title}
          </Typography>
          <Typography
            sx={{
              color: C.muted,
              fontSize: 11.5,
              lineHeight: 1.5,
              mt: 0.35,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
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
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        minHeight: 104,
        p: 1.8,
        borderRadius: "14px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexDirection: "column",
        gap: 1.25,
        textAlign: "left",
        textTransform: "none",
        color: C.text,
        border: `1px solid ${C.border}`,
        bgcolor: "rgba(255,255,255,0.018)",
        transition: "border-color 160ms ease, background-color 160ms ease",
        "&:hover": {
          bgcolor: `${color}0D`,
          borderColor: `${color}70`,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: "100%", gap: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.1} sx={{ minWidth: 0 }}>
          <Box sx={{ color, display: "flex", "& svg": { fontSize: 21 } }}>
            {icon}
          </Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 750,
              lineHeight: 1.4,
              color: C.text,
            }}
          >
            {title}
          </Typography>
        </Stack>
        <ArrowForwardRoundedIcon sx={{ color: C.soft, fontSize: 17, flexShrink: 0 }} />
      </Stack>
      <Typography
        sx={{
          color: C.muted,
          fontSize: 11.5,
          lineHeight: 1.55,
          whiteSpace: "normal",
          fontWeight: 400,
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
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getDocumentsAPI();
      const docs = data?.documents ?? data?.data;
      if (Array.isArray(docs)) {
        setDocumentCount(docs.length);
      } else {
        setDocumentCount(null);
        setError("We couldn't read your document list. Please try again.");
      }
    } catch {
      setDocumentCount(null);
      setError("Documents couldn't be loaded. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const stats = [
    {
      title: "Documents",
      value: documentCount ?? "—",
      subtitle: "Uploaded to your library",
      icon: <FolderOpenRoundedIcon />,
      color: C.purple,
      onClick: () => navigate("/documents"),
    },
    {
      title: "AI conversations",
      value: "Chat",
      subtitle: "Ask questions about your notes",
      icon: <ChatRoundedIcon />,
      color: C.violet,
      onClick: () => navigate("/chat"),
    },
    {
      title: "Knowledge graph",
      value: "Explore",
      subtitle: "Discover connected ideas",
      icon: <HubRoundedIcon />,
      color: C.cyan,
      onClick: () => navigate("/graph"),
    },
    {
      title: "Study workspace",
      value: "Learn",
      subtitle: "Practice and revise",
      icon: <SchoolRoundedIcon />,
      color: C.green,
      onClick: () => navigate("/study"),
    },
  ];

  const actions = [
    {
      title: "Upload documents",
      description: "Add PDFs and learning materials",
      icon: <UploadFileRoundedIcon />,
      color: C.purple,
      path: "/documents",
    },
    {
      title: "Start a conversation",
      description: "Ask questions and explore your notes",
      icon: <ChatRoundedIcon />,
      color: C.violet,
      path: "/chat",
    },
    {
      title: "Explore knowledge graph",
      description: "See connections between concepts",
      icon: <AccountTreeRoundedIcon />,
      color: C.cyan,
      path: "/graph",
    },
    {
      title: "Practice and revise",
      description: "Continue learning in Study Mode",
      icon: <QuizRoundedIcon />,
      color: C.green,
      path: "/study",
    },
    {
      title: "Research a topic",
      description: "Open your research workspace",
      icon: <SearchRoundedIcon />,
      color: C.amber,
      path: "/research",
    },
    {
      title: "Review contradictions",
      description: "Inspect potential knowledge conflicts",
      icon: <WarningAmberRoundedIcon />,
      color: C.rose,
      path: "/contradictions",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1500,
        mx: "auto",
        pb: { xs: 3, md: 4 },
        color: C.text,
      }}
    >
      {/* Compact welcome header */}
      <Paper
        elevation={0}
        sx={{
          ...panelSx,
          p: { xs: 2.2, sm: 3 },
          mb: 3,
          background:
            "radial-gradient(ellipse at 88% 0%, rgba(139,124,255,0.12), transparent 43%), #10111C",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          gap={2.25}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.4 }}>
              <AutoAwesomeRoundedIcon sx={{ color: C.purple, fontSize: 17 }} />
              <Typography
                sx={{
                  color: C.purple,
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: 1.25,
                  textTransform: "uppercase",
                }}
              >
                Your AI workspace
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: { xs: 24, sm: 29, lg: 31 },
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {greeting}, {user?.name || "there"} <Box component="span">👋</Box>
            </Typography>
            <Typography sx={{ mt: 0.9, color: C.muted, fontSize: 12.5 }}>
              {today}
            </Typography>
            <Typography
              sx={{
                mt: 1.2,
                maxWidth: 590,
                color: "#C3C4D4",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Your knowledge, connected. Bring your notes together, explore ideas,
              and make every study session count.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<ChatRoundedIcon />}
            onClick={() => navigate("/chat")}
            sx={{
              boxSizing: "border-box",
              width: "auto",
              minWidth: 178,
              maxWidth: "100%",
              minHeight: 46,
              flex: "0 0 auto",
              alignSelf: { xs: "stretch", sm: "center" },
              px: 2.2,
              py: 1.1,
              borderRadius: "11px",
              fontSize: 13,
              fontWeight: 750,
              textTransform: "none",
              whiteSpace: "nowrap",
              bgcolor: C.purple,
              color: "#fff",
              boxShadow: "0 5px 18px rgba(139,124,255,0.17)",
              "&:hover": { bgcolor: "#7868F5", boxShadow: "none" },
            }}
          >
            Start a new chat
          </Button>
        </Stack>
      </Paper>

      {/* Overview */}
      <SectionHeading
        eyebrow="Overview"
        title="Your workspace"
        description="A quick look at your learning tools"
        action={
          <Button
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={loadDocuments}
            disabled={loading}
            sx={{
              textTransform: "none",
              color: C.muted,
              fontSize: 12,
              borderRadius: "9px",
              "&:hover": { color: C.text, bgcolor: "rgba(255,255,255,0.05)" },
            }}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            borderRadius: "12px",
            bgcolor: "rgba(245,184,75,0.08)",
            color: C.text,
            border: "1px solid rgba(245,184,75,0.2)",
            "& .MuiAlert-icon": { color: C.amber },
          }}
          action={
            <Button color="inherit" size="small" onClick={loadDocuments}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={1.75}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <StatCard
              {...stat}
              loading={loading && stat.title === "Documents"}
            />
          </Grid>
        ))}
      </Grid>

      {/* Quick actions */}
      <Box sx={{ mt: 4 }}>
        <SectionHeading
          eyebrow="Get started"
          title="Quick actions"
          description="Jump straight into what you want to do"
        />
        <Grid container spacing={1.5}>
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

      {/* Bottom information panels */}
      <Grid container spacing={1.75} sx={{ mt: 2 }}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              ...panelSx,
              p: { xs: 2, sm: 2.5 },
              height: "100%",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.1} sx={{ mb: 1.2 }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: `${C.purple}17`,
                  color: C.purple,
                }}
              >
                <DescriptionRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 750 }}>
                  Knowledge library
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 11.5, mt: 0.2 }}>
                  Your documents in one place
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 1.8, borderColor: C.border }} />

            {loading ? (
              <Skeleton width="65%" />
            ) : documentCount === null ? (
              <Typography sx={{ color: C.muted, fontSize: 12.5 }}>
                Document statistics are currently unavailable.
              </Typography>
            ) : documentCount === 0 ? (
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13 }}>
                  Start building your knowledge library
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 12, mt: 0.6, lineHeight: 1.6 }}>
                  Upload study notes or PDFs to start asking questions about your materials.
                </Typography>
              </Box>
            ) : (
              <Typography sx={{ color: C.muted, fontSize: 12.5, lineHeight: 1.7 }}>
                You have{" "}
                <Box component="span" sx={{ color: C.cyan, fontWeight: 800 }}>
                  {documentCount} {documentCount === 1 ? "document" : "documents"}
                </Box>{" "}
                in your workspace. Open the library to manage your files.
              </Typography>
            )}

            <Button
              onClick={() => navigate("/documents")}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 1.7,
                p: 0,
                textTransform: "none",
                fontSize: 12.5,
                fontWeight: 750,
                color: C.purple,
                "&:hover": { bgcolor: "transparent", color: C.violet },
              }}
            >
              Open documents
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              ...panelSx,
              p: { xs: 2, sm: 2.5 },
              height: "100%",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.1} sx={{ mb: 1.2 }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: `${C.cyan}17`,
                  color: C.cyan,
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 750 }}>
                  Continue exploring
                </Typography>
                <Typography sx={{ color: C.muted, fontSize: 11.5, mt: 0.2 }}>
                  Pick your next step
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={0.8} sx={{ mt: 1.7 }}>
              {[
                { label: "Ask your notes a question", path: "/chat" },
                { label: "Explore connected concepts", path: "/graph" },
                { label: "Open research workspace", path: "/research" },
              ].map((item) => (
                <Button
                  key={item.label}
                  fullWidth
                  onClick={() => navigate(item.path)}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    justifyContent: "space-between",
                    textAlign: "left",
                    textTransform: "none",
                    color: "#DCDD EB".replace(" ", ""),
                    fontSize: 12.5,
                    fontWeight: 600,
                    borderRadius: "9px",
                    px: 1.3,
                    py: 1.1,
                    bgcolor: "rgba(255,255,255,0.022)",
                    "&:hover": {
                      bgcolor: "rgba(139,124,255,0.09)",
                      color: "#FFFFFF",
                    },
                    "& .MuiButton-endIcon": { color: C.soft },
                  }}
                >
                  {item.label}
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
'''
# correct an awkward but valid-ish color expression to a simple hex
code = code.replace('"#DCDD EB".replace(" ", "")', '"#DCDDED"')
path = Path("/mnt/data/Dashboard.jsx")
path.write_text(code, encoding="utf-8")
print(f"Created {path} ({len(code.splitlines())} lines)")
