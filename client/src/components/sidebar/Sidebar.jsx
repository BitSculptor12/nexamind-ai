import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import {
  NavLink,
} from "react-router-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useAuth } from "../../contexts/AuthContext";

const menuSections = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon /> },
      { label: "Chat", path: "/chat", icon: <ChatRoundedIcon /> },
      { label: "Documents", path: "/documents", icon: <FolderOpenRoundedIcon /> }
    ]
  },
  {
    label: "AI FEATURES",
    items: [
      { label: "Knowledge Graph", path: "/graph", icon: <HubRoundedIcon /> },
      { label: "Contradictions", path: "/contradictions", icon: <WarningAmberRoundedIcon /> },
      { label: "Research", path: "/research", icon: <TravelExploreRoundedIcon /> },
      { label: "AI Memory", path: "/memory", icon: <PsychologyRoundedIcon /> },
      { label: "Study Mode", path: "/study", icon: <SchoolRoundedIcon /> },
      { label: "AI Agents", path: "/agents", icon: <SmartToyRoundedIcon /> }
    ]
  },
  {
    label: "INSIGHTS",
    items: [
      { label: "Analytics", path: "/analytics", icon: <BarChartRoundedIcon /> },
      { label: "Team", path: "/team", icon: <GroupsRoundedIcon /> }
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> }
    ]
  }
];

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        width: collapsed ? 68 : 260,
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        transition: "width 0.25s ease",
        bgcolor: "#0d0d18",
        borderRight: "1px solid rgba(108,99,255,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: collapsed ? "center" : "space-between", alignItems: "center" }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: "linear-gradient(135deg, #6C63FF, #8B5CF6)"
            }}
          />
          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={800} fontSize={18} noWrap>
                NexaMind
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                AI Workspace
              </Typography>
            </Box>
          )}
        </Stack>

        {!collapsed && (
          <IconButton
            onClick={onToggle}
            sx={{
              color: "rgba(255,255,255,0.7)"
            }}
          >
            <MenuOpenRoundedIcon />
          </IconButton>
        )}
      </Box>

      {collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
          <IconButton onClick={onToggle} sx={{ color: "rgba(255,255,255,0.7)" }}>
            <MenuRoundedIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ px: collapsed ? 1 : 2, py: 1, flex: 1, overflowY: "auto" }}>
        <Stack spacing={2}>
          {menuSections.map((section) => (
            <Box key={section.label}>
              {!collapsed && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 700,
                    letterSpacing: 1
                  }}
                >
                  {section.label}
                </Typography>
              )}

              <Stack spacing={0.5} sx={{ mt: 1 }}>
                {section.items.map((item) => {
                  const active = isActive(item.path);

                  const button = (
                   <Button
  key={item.label}
  component={NavLink}
  to={item.path}
  startIcon={item.icon}
  sx={{
    justifyContent: collapsed
      ? "center"
      : "flex-start",

    minWidth: 0,

    px: collapsed
      ? 1
      : 2,

    py: 1.4,

    borderRadius: 3,

    textTransform: "none",

    fontWeight: 700,

    color: active
      ? "#c4c0ff"
      : "#fff",

    bgcolor: active
      ? "rgba(108,99,255,0.15)"
      : "transparent",

    borderLeft: active
      ? "3px solid #6C63FF"
      : "3px solid transparent",

    "&:hover": {
      bgcolor:
        "rgba(255,255,255,0.04)"
    }
  }}
>
  {!collapsed &&
    item.label}
</Button>
                  );

                  return collapsed ? (
                    <Tooltip key={item.label} title={item.label} placement="right">
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: "#6C63FF", width: 42, height: 42 }}>
            {(user?.name || "N").charAt(0).toUpperCase()}
          </Avatar>

          {!collapsed && (
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography fontWeight={700} noWrap>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }} noWrap>
                {user?.email || "user@nexamind.ai"}
              </Typography>
            </Box>
          )}

          <IconButton onClick={handleLogout} sx={{ color: "#EF4444" }}>
            <LogoutRoundedIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

export default Sidebar;