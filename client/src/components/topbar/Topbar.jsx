import {
  Badge,
  Box,
  Chip,
  IconButton,
  InputBase,
  Stack,
  Typography,
  Avatar
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const pageMap = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your AI workspace"
  },
  "/chat": {
    title: "Chat Workspace",
    subtitle: "Talk to your AI assistant"
  },
  "/documents": {
    title: "Documents",
    subtitle: "Manage your knowledge sources"
  },
  "/graph": {
    title: "Knowledge Graph",
    subtitle: "Explore connected ideas"
  },
  "/contradictions": {
    title: "Contradiction Detector",
    subtitle: "Find conflicts across sources"
  },
  "/study": {
    title: "Study Mode",
    subtitle: "Turn notes into flashcards"
  },
  "/agents": {
    title: "AI Agents",
    subtitle: "Launch task-specific agents"
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Track usage and insight trends"
  },
  "/settings": {
    title: "Settings",
    subtitle: "Personalize your workspace"
  }
};

function Topbar() {
  const location = useLocation();
  const { user } = useAuth();

  const page = pageMap[location.pathname] || {
    title: "NexaMind",
    subtitle: "AI workspace"
  };

  return (
    <Box
      sx={{
        height: 64,
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#0a0a15",
        borderBottom: "1px solid rgba(108,99,255,0.1)",
        flexShrink: 0
      }}
    >
      <Box>
        <Typography fontWeight={800} fontSize={20}>
          {page.title}
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
          {page.subtitle}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "32%",
          maxWidth: 420,
          px: 2,
          py: 1,
          borderRadius: 999,
          bgcolor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(108,99,255,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <SearchRoundedIcon sx={{ color: "rgba(255,255,255,0.45)" }} />
        <InputBase
          placeholder="Search workspace..."
          sx={{
            flex: 1,
            color: "#fff",
            "& input::placeholder": {
              color: "rgba(255,255,255,0.35)",
              opacity: 1
            }
          }}
        />
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Chip
          label="AI Ready"
          sx={{
            bgcolor: "rgba(16,185,129,0.15)",
            color: "#10B981",
            fontWeight: 700
          }}
        />

        <IconButton sx={{ color: "#fff" }}>
          <Badge badgeContent={3} color="error">
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>

        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar src={user?.profileImage || ""} sx={{ width: 38, height: 38, bgcolor: "#6C63FF" }}>
            {(user?.name || "U").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography fontWeight={700} lineHeight={1.1}>
              {user?.name || "User"}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
              Member
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Topbar;