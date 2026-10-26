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
  const [voiceHint, setVoiceHint] = useState("");
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
    setVoiceHint("");
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
    setVoiceHint("");

    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setError(
        "Voice typing is not available in this browser. Try the latest Chrome or Edge, or type your message."
      );
      return;
    }

    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // The recognizer may already have stopped.
      }
      setListening(false);
      setVoiceHint("Voice input stopped. Review your transcript before sending.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const startingText = input.trim();
      let recognitionFailed = false;

      // Use Indian English by default for this app's primary audience.
      // Change this to "hi-IN" if you mainly want Hindi transcription.
      recognition.lang = "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setListening(true);
        setVoiceHint("Listening now — speak clearly, then press stop.");
      };

      recognition.onresult = (event) => {
        // SpeechRecognition.results contains the current final and interim
        // transcript. Rebuild it each time instead of appending interim text,
        // which would duplicate words on successive result events.
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || "")
          .filter(Boolean)
          .join(" ")
          .trim();

        if (transcript) {
          setInput(
            [startingText, transcript]
              .filter(Boolean)
              .join(" ")
              .trim()
          );
        }
      };

      recognition.onerror = (event) => {
        recognitionFailed = true;
        setListening(false);
        setVoiceHint("");

        const errorMessages = {
          "not-allowed":
            "Microphone permission is blocked. Click the site icon beside the address bar, allow Microphone, then reload the page.",
          "service-not-allowed":
            "The browser blocked its speech-recognition service. Check browser permissions or try Chrome/Edge with microphone access enabled.",
          "audio-capture":
            "No microphone audio could be captured. Check that your microphone is connected and not being used exclusively by another app.",
          "no-speech":
            "No speech was detected. Click the microphone, wait for the listening indicator, then speak clearly.",
          network:
            "The browser speech service could not connect (network error). Check your internet connection. If it keeps happening, browser-based transcription may be unavailable and a server-side transcription service is needed.",
          "language-not-supported":
            "The browser speech service does not support English (India). Change recognition.lang to 'en-US' in Chat.jsx and try again.",
          aborted: "",
        };

        const message =
          errorMessages[event.error] ||
          `Speech recognition failed (${event.error || "unknown error"}). Check microphone permission and internet access, then try again.`;

        if (message) setError(message);
        // Keep this useful for debugging in the browser console.
        console.warn("NexaMind speech recognition error:", event.error);
      };

      recognition.onend = () => {
        setListening(false);
        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }

        if (!recognitionFailed) {
          setVoiceHint((current) =>
            current || "Voice input stopped. Review your transcript before sending."
          );
        }

        inputRef.current?.focus();
      };

      recognition.start();
      setListening(true);
      setVoiceHint("Starting microphone…");
      inputRef.current?.focus();
    } catch (err) {
      setListening(false);
      setVoiceHint("");
      setError(
        err?.name === "NotAllowedError"
          ? "Microphone permission is blocked. Allow microphone access for this site and retry."
          : "Could not start voice input. Check browser microphone permissions and try again."
      );
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
                    disabled={!input.trim() || loading || listening}
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
            {(listening || voiceHint) && (
              <Box
                className={`nx-chat__voice-status${listening ? " is-listening" : ""}`}
                role="status"
                aria-live="polite"
              >
                <span className="nx-chat__voice-dot" />
                <Typography component="span">
                  {listening ? "Listening now — speak clearly, then press stop." : voiceHint}
                </Typography>
              </Box>
            )}
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
