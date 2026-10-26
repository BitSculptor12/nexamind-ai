import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MicNoneRoundedIcon from "@mui/icons-material/MicNoneRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import ReactMarkdown from "react-markdown";
import { apiUrl } from "../config";
import "../Chat.css";

const C = {
  bg: "#090A12",
  panel: "#10111C",
  panel2: "#141526",
  text: "#F5F5FC",
  muted: "#A1A3B8",
  soft: "#787D96",
  border: "rgba(160, 160, 210, 0.14)",
  purple: "#9382FF",
  violet: "#B49AFF",
  cyan: "#42D8E8",
  green: "#43D9A3",
};

const suggestions = [
  {
    icon: <MenuBookRoundedIcon />,
    title: "Explain my notes",
    prompt: "Explain the key concepts from my uploaded notes in simple words.",
  },
  {
    icon: <AutoAwesomeRoundedIcon />,
    title: "Create a summary",
    prompt: "Create a clear summary of my uploaded study material.",
  },
  {
    icon: <AddCommentRoundedIcon />,
    title: "Test my knowledge",
    prompt: "Create 5 practice questions from my uploaded notes.",
  },
];

function sourceLabel(source, index) {
  if (typeof source === "string") return source;
  if (source && typeof source === "object") {
    return (
      source.title ||
      source.filename ||
      source.name ||
      source.fileName ||
      source.url ||
      `Source ${index + 1}`
    );
  }
  return `Source ${index + 1}`;
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;

    setError("");
    setInput("");
    setLoading(true);
    setMessages((previous) => [
      ...previous,
      { type: "user", text: question },
    ]);

    try {
      const token = localStorage.getItem("nexamind_token");
      const response = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Your session may have expired. Please sign in again and retry."
          );
        }
        throw new Error(
          data?.message ||
            data?.error ||
            `The request failed (HTTP ${response.status}). Please try again.`
        );
      }

      const answer = data?.reply ?? data?.message ?? data?.answer;
      if (answer === undefined || answer === null || answer === "") {
        throw new Error(
          "The server responded but did not return an answer. Please try again."
        );
      }

      const sources = Array.isArray(data?.sources)
        ? data.sources
        : data?.sources
          ? [data.sources]
          : [];

      setMessages((previous) => [
        ...previous,
        {
          type: "assistant",
          text: typeof answer === "string" ? answer : JSON.stringify(answer, null, 2),
          sources,
        },
      ]);
    } catch (err) {
      setError(
        err?.message ||
          "Could not connect to NexaMind. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleVoiceInput = () => {
    setError("");

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setError(
        "Voice typing is not supported in this browser. Try the latest Chrome or Edge, or type your message."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = navigator.language || "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      const startingText = input.trim();

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .trim();

        if (transcript) {
          setInput(
            startingText
              ? `${startingText} ${transcript}`
              : transcript
          );
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setError(
            "Microphone access was blocked. Allow microphone permission in your browser settings and try again."
          );
        } else if (event.error === "no-speech") {
          setError("No speech was detected. Try speaking a little louder.");
        } else if (event.error !== "aborted") {
          setError("Voice transcription stopped. You can try again or type your message.");
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }
        inputRef.current?.focus();
      };

      recognition.start();
      setListening(true);
      inputRef.current?.focus();
    } catch {
      setListening(false);
      setError("Could not start the microphone. Please check browser permissions.");
    }
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => {
        setCopiedIndex((current) => (current === index ? null : current));
      }, 1600);
    } catch {
      setError("Copy was blocked by your browser. Select the answer text and copy it manually.");
    }
  };

  const chooseSuggestion = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <Box className="nx-chat">
      <Box className="nx-chat__shell">
        <Paper elevation={0} className="nx-chat__panel">
          <Box className="nx-chat__header">
            <Stack direction="row" alignItems="center" spacing={1.4} sx={{ minWidth: 0 }}>
              <Avatar className="nx-chat__brand-avatar">
                <AutoAwesomeRoundedIcon />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h1" className="nx-chat__title">
                  NexaMind Chat
                </Typography>
                <Typography component="p" className="nx-chat__subtitle">
                  Ask questions about your knowledge
                </Typography>
              </Box>
            </Stack>
            <Chip
              size="small"
              label="AI assistant"
              className="nx-chat__header-chip"
            />
          </Box>

          <Divider className="nx-chat__divider" />

          <Box className="nx-chat__messages" aria-live="polite">
            {messages.length === 0 ? (
              <Box className="nx-chat__welcome">
                <Box className="nx-chat__welcome-icon">
                  <AutoAwesomeRoundedIcon />
                </Box>
                <Typography component="h2" className="nx-chat__welcome-title">
                  What would you like to learn?
                </Typography>
                <Typography component="p" className="nx-chat__welcome-copy">
                  Ask a question about your notes, summarize a document, or
                  explore a concept. Clear answers work best when your source
                  material is uploaded.
                </Typography>

                <Box className="nx-chat__suggestions">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion.title}
                      onClick={() => chooseSuggestion(suggestion.prompt)}
                      className="nx-chat__suggestion"
                      startIcon={suggestion.icon}
                    >
                      <span>{suggestion.title}</span>
                    </Button>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box className="nx-chat__message-list">
                {messages.map((message, index) => (
                  <Box
                    key={`${message.type}-${index}`}
                    className={`nx-chat__row nx-chat__row--${message.type}`}
                  >
                    {message.type === "assistant" && (
                      <Avatar className="nx-chat__message-avatar">
                        <AutoAwesomeRoundedIcon />
                      </Avatar>
                    )}

                    <Box
                      className={`nx-chat__message nx-chat__message--${message.type}`}
                    >
                      {message.type === "assistant" && (
                        <Typography component="div" className="nx-chat__sender">
                          NexaMind
                        </Typography>
                      )}

                      {message.type === "user" ? (
                        <Typography component="p" className="nx-chat__user-text">
                          {message.text}
                        </Typography>
                      ) : (
                        <Box className="nx-chat__markdown">
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </Box>
                      )}

                      {message.sources?.length > 0 && (
                        <Box className="nx-chat__sources">
                          <Typography component="span" className="nx-chat__sources-label">
                            Sources
                          </Typography>
                          {message.sources.map((source, sourceIndex) => (
                            <Chip
                              key={`${sourceLabel(source, sourceIndex)}-${sourceIndex}`}
                              size="small"
                              label={sourceLabel(source, sourceIndex)}
                              className="nx-chat__source-chip"
                            />
                          ))}
                        </Box>
                      )}

                      {message.type === "assistant" && (
                        <Box className="nx-chat__message-actions">
                          <Tooltip title={copiedIndex === index ? "Copied" : "Copy answer"}>
                            <IconButton
                              size="small"
                              onClick={() => handleCopy(message.text, index)}
                              aria-label="Copy answer"
                              className="nx-chat__copy-button"
                            >
                              <ContentCopyRoundedIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                          <Typography component="span" className="nx-chat__copy-label">
                            {copiedIndex === index ? "Copied" : "Copy"}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}

                {loading && (
                  <Box className="nx-chat__row nx-chat__row--assistant">
                    <Avatar className="nx-chat__message-avatar">
                      <AutoAwesomeRoundedIcon />
                    </Avatar>
                    <Box className="nx-chat__thinking">
                      <CircularProgress size={16} thickness={5} />
                      <Typography component="span">
                        Thinking through your question…
                      </Typography>
                    </Box>
                  </Box>
                )}
                <div ref={bottomRef} />
              </Box>
            )}
          </Box>

          {error && (
            <Alert
              severity="warning"
              onClose={() => setError("")}
              className="nx-chat__error"
            >
              {error}
            </Alert>
          )}

          <Box className="nx-chat__composer-wrap">
            <Box className="nx-chat__composer">
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                minRows={1}
                maxRows={5}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about your notes…"
                variant="outlined"
                className="nx-chat__input"
                inputProps={{ "aria-label": "Message NexaMind" }}
              />

              <Tooltip title={listening ? "Stop voice typing" : "Transcribe speech"}>
                <IconButton
                  onClick={handleVoiceInput}
                  disabled={loading}
                  aria-label={listening ? "Stop voice typing" : "Start voice typing"}
                  className={`nx-chat__voice-button${listening ? " is-listening" : ""}`}
                >
                  {listening ? <StopRoundedIcon /> : <MicNoneRoundedIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Send message">
                <span>
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="nx-chat__send-button"
                  >
                    {loading ? (
                      <CircularProgress size={19} sx={{ color: "#fff" }} />
                    ) : (
                      <SendRoundedIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Typography component="p" className="nx-chat__hint">
              Enter to send · Shift + Enter for a new line · Use the microphone to dictate
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Chat;
