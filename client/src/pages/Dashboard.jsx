import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDocumentsAPI } from "../api/documents";
import "../App.css";

const ROUTES = {
  documents: "/documents",
  chat: "/chat",
  graph: "/graph",
  study: "/study",
  research: "/research",
  contradictions: "/contradictions",
};

const COLORS = {
  purple: "#9382FF",
  violet: "#B49AFF",
  cyan: "#42D8E8",
  green: "#43D9A3",
  amber: "#F5BD61",
  rose: "#FA8296",
  text: "#F5F5FC",
  muted: "#9DA1BA",
};

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="nx-section-heading">
      <div className="nx-section-heading__copy">
        {eyebrow && <div className="nx-eyebrow">{eyebrow}</div>}
        <Typography component="h2" className="nx-section-heading__title">
          {title}
        </Typography>
        {description && (
          <Typography component="p" className="nx-section-heading__description">
            {description}
          </Typography>
        )}
      </div>
      {action}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color, loading, onClick }) {
  return (
    <Paper
      elevation={0}
      component={onClick ? "button" : "div"}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="nx-stat-card"
      style={{ "--nx-accent": color }}
    >
      <div className="nx-stat-card__top">
        <span className="nx-stat-card__icon">{icon}</span>
        {onClick && (
          <ArrowForwardRoundedIcon className="nx-stat-card__arrow" />
        )}
      </div>

      {loading ? (
        <div className="nx-stat-card__loading">
          <Skeleton width="48%" height={30} />
          <Skeleton width="72%" height={18} />
          <Skeleton width="88%" height={16} />
        </div>
      ) : (
        <div className="nx-stat-card__body">
          <Typography component="div" className="nx-stat-card__value">
            {value}
          </Typography>
          <Typography component="div" className="nx-stat-card__title">
            {title}
          </Typography>
          <Typography component="div" className="nx-stat-card__subtitle">
            {subtitle}
          </Typography>
        </div>
      )}
    </Paper>
  );
}

function ActionCard({ title, description, icon, color, onClick }) {
  return (
    <Button
      onClick={onClick}
      className="nx-action-card"
      style={{ "--nx-accent": color }}
      disableElevation
      disableRipple={false}
    >
      <span className="nx-action-card__top">
        <span className="nx-action-card__icon">{icon}</span>
        <span className="nx-action-card__title">{title}</span>
        <ArrowForwardRoundedIcon className="nx-action-card__arrow" />
      </span>
      <span className="nx-action-card__description">{description}</span>
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
        year: "numeric",
      }),
    []
  );

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getDocumentsAPI();
      const docs = response?.documents ?? response?.data;
      if (Array.isArray(docs)) {
        setDocumentCount(docs.length);
      } else {
        setDocumentCount(null);
        setError("The document list returned an unexpected response.");
      }
    } catch {
      setDocumentCount(null);
      setError("Documents could not be loaded. Check your connection and retry.");
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
      value: documentCount === null ? "—" : documentCount,
      subtitle: "Files in your knowledge library",
      icon: <FolderOpenRoundedIcon />,
      color: COLORS.purple,
      onClick: () => navigate(ROUTES.documents),
    },
    {
      title: "AI Chat",
      value: "Ask",
      subtitle: "Get help from your knowledge",
      icon: <ChatRoundedIcon />,
      color: COLORS.violet,
      onClick: () => navigate(ROUTES.chat),
    },
    {
      title: "Knowledge Graph",
      value: "Explore",
      subtitle: "Discover connected concepts",
      icon: <HubRoundedIcon />,
      color: COLORS.cyan,
      onClick: () => navigate(ROUTES.graph),
    },
    {
      title: "Study Mode",
      value: "Learn",
      subtitle: "Practice and revise",
      icon: <SchoolRoundedIcon />,
      color: COLORS.green,
      onClick: () => navigate(ROUTES.study),
    },
  ];

  const actions = [
    {
      title: "Upload documents",
      description: "Add PDFs and your study material",
      icon: <UploadFileRoundedIcon />,
      color: COLORS.purple,
      path: ROUTES.documents,
    },
    {
      title: "Start a conversation",
      description: "Ask questions about your notes",
      icon: <ChatRoundedIcon />,
      color: COLORS.violet,
      path: ROUTES.chat,
    },
    {
      title: "Explore the graph",
      description: "See links between your concepts",
      icon: <AccountTreeRoundedIcon />,
      color: COLORS.cyan,
      path: ROUTES.graph,
    },
    {
      title: "Practice and revise",
      description: "Open your Study Mode workspace",
      icon: <QuizRoundedIcon />,
      color: COLORS.green,
      path: ROUTES.study,
    },
    {
      title: "Research a topic",
      description: "Continue in the research workspace",
      icon: <SearchRoundedIcon />,
      color: COLORS.amber,
      path: ROUTES.research,
    },
    {
      title: "Review contradictions",
      description: "Inspect possible knowledge conflicts",
      icon: <WarningAmberRoundedIcon />,
      color: COLORS.rose,
      path: ROUTES.contradictions,
    },
  ];

  return (
    <Box className="nx-dashboard">
      <Paper elevation={0} className="nx-hero">
        <div className="nx-hero__glow" aria-hidden="true" />
        <div className="nx-hero__content">
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="YOUR AI WORKSPACE"
            size="small"
            className="nx-hero__badge"
          />
          <Typography component="h1" className="nx-hero__title">
            {greeting}, {user?.name || "there"} <span aria-hidden="true">👋</span>
          </Typography>
          <Typography component="p" className="nx-hero__date">
            {today}
          </Typography>
          <Typography component="p" className="nx-hero__description">
            Your knowledge, connected. Organize your notes, explore ideas, and
            make every study session count.
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<ChatRoundedIcon />}
          onClick={() => navigate(ROUTES.chat)}
          className="nx-primary-cta"
          disableElevation
        >
          Start a new chat
        </Button>
      </Paper>

      <section className="nx-dashboard-section" aria-labelledby="nx-overview-title">
        <SectionHeading
          eyebrow="Overview"
          title="Your workspace"
          description="Your essential tools in one place"
          action={
            <Button
              size="small"
              startIcon={<RefreshRoundedIcon />}
              onClick={loadDocuments}
              disabled={loading}
              className="nx-refresh-button"
            >
              Refresh
            </Button>
          }
        />

        {error && (
          <Alert
            severity="warning"
            className="nx-dashboard-alert"
            action={
              <Button color="inherit" size="small" onClick={loadDocuments}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <div className="nx-stat-grid">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
              loading={loading && stat.title === "Documents"}
            />
          ))}
        </div>
      </section>

      <section className="nx-dashboard-section">
        <SectionHeading
          eyebrow="Get things done"
          title="Quick actions"
          description="Jump straight into your next task"
        />
        <div className="nx-action-grid">
          {actions.map((action) => (
            <ActionCard
              key={action.title}
              {...action}
              onClick={() => navigate(action.path)}
            />
          ))}
        </div>
      </section>

      <div className="nx-bottom-grid">
        <Paper elevation={0} className="nx-info-panel">
          <div className="nx-info-panel__heading">
            <span className="nx-info-panel__icon nx-info-panel__icon--purple">
              <DescriptionRoundedIcon />
            </span>
            <div>
              <Typography component="h2" className="nx-info-panel__title">
                Knowledge library
              </Typography>
              <Typography component="p" className="nx-info-panel__subtitle">
                Your uploaded material, ready to explore
              </Typography>
            </div>
          </div>

          <Divider className="nx-divider" />

          {loading ? (
            <Skeleton width="68%" height={22} />
          ) : documentCount === null ? (
            <Typography component="p" className="nx-info-panel__copy">
              Document statistics are currently unavailable.
            </Typography>
          ) : documentCount === 0 ? (
            <div>
              <Typography component="p" className="nx-info-panel__copy nx-info-panel__copy--strong">
                Start building your knowledge library
              </Typography>
              <Typography component="p" className="nx-info-panel__copy">
                Upload notes or PDFs to start asking questions about your material.
              </Typography>
            </div>
          ) : (
            <Typography component="p" className="nx-info-panel__copy">
              You have{" "}
              <strong>
                {documentCount} {documentCount === 1 ? "document" : "documents"}
              </strong>{" "}
              in your workspace.
            </Typography>
          )}

          <Button
            onClick={() => navigate(ROUTES.documents)}
            endIcon={<ArrowForwardRoundedIcon />}
            className="nx-text-link"
          >
            Open documents
          </Button>
        </Paper>

        <Paper elevation={0} className="nx-info-panel">
          <div className="nx-info-panel__heading">
            <span className="nx-info-panel__icon nx-info-panel__icon--cyan">
              <AutoAwesomeRoundedIcon />
            </span>
            <div>
              <Typography component="h2" className="nx-info-panel__title">
                Continue exploring
              </Typography>
              <Typography component="p" className="nx-info-panel__subtitle">
                Choose where to go next
              </Typography>
            </div>
          </div>

          <div className="nx-next-list">
            {[
              { label: "Ask your notes a question", path: ROUTES.chat },
              { label: "Explore connected concepts", path: ROUTES.graph },
              { label: "Open research workspace", path: ROUTES.research },
            ].map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                endIcon={<ArrowForwardRoundedIcon />}
                className="nx-next-item"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Paper>
      </div>
    </Box>
  );
}

export default Dashboard;
