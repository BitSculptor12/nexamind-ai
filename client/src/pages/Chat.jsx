import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";

import { apiUrl } from "../config";
function Chat() {
  const [messages, setMessages] =
    useState([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef =
    useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [messages]);

  const handleSend =
    async () => {
      if (!input.trim())
        return;

      const userMessage = {
        type: "user",
        text: input,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      const question =
        input;

      setInput("");
      setLoading(true);

      try {
        const token =
          localStorage.getItem(
            "nexamind_token"
          );

        const res =
          await fetch(
            apiUrl("/api/chat"),
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify(
                {
                  message:
                    question,
                }
              ),
            }
          );

        const data =
          await res.json();

        setMessages((prev) => [
          ...prev,
          {
            type:
              "assistant",

            text:
              data.reply ||
              data.message,

            sources:
              data.sources ||
              [],
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            type:
              "assistant",

            text:
              "Server error.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        display: "flex",
        height:
          "calc(100vh - 64px)",
        overflow: "hidden",
        bgcolor:
          "#080810",
      }}
    >
      {/* LEFT */}

      <Box
        sx={{
          width: 240,
          borderRight:
            "1px solid rgba(108,99,255,0.12)",
        }}
      />

      {/* CENTER */}

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection:
            "column",
          overflow: "hidden",
        }}
      >
        {/* MESSAGES */}

       <Box
  sx={{
    flex: 1,
    overflowY: "auto",
    px: 4,
    py: 3,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
  }}
>
  {messages.map(
    (message, i) => (
      <Box
        key={i}
        sx={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",

          justifyContent:
            message.type ===
            "user"
              ? "flex-end"
              : "flex-start",
        }}
      >
        <Box
          sx={{
            bgcolor:
              message.type ===
              "user"
                ? "#6C63FF"
                : "#11111B",

            color: "#fff",

            p: 2.2,

            borderRadius: 3,

            width: "fit-content",

            maxWidth: "85%",

            border:
              message.type ===
              "assistant"
                ? "1px solid rgba(108,99,255,0.15)"
                : "none",
          }}
        >
          <ReactMarkdown>
            {message.text}
          </ReactMarkdown>

          {message.sources &&
            message.sources
              .length > 0 && (
              <Box
                sx={{
                  display:
                    "flex",
                  gap: 1,
                  flexWrap:
                    "wrap",
                  mt: 1.5,
                }}
              >
                {message.sources.map(
                  (
                    src,
                    index
                  ) => (
                    <Chip
                      key={
                        index
                      }
                      label={`📄 ${src}`}
                      size="small"
                      sx={{
                        bgcolor:
                          "rgba(108,99,255,0.12)",

                        color:
                          "#b7b2ff",

                        fontSize: 11,
                      }}
                    />
                  )
                )}
              </Box>
            )}
        </Box>
      </Box>
    )
  )}

  <div ref={bottomRef} />
</Box>
                {/* <Typography>
                  {
                    message.text
                  }
                </Typography>

                {message.sources &&
                  message
                    .sources
                    .length >
                    0 && (
                    <Box
                      sx={{
                        display:
                          "flex",
                        gap: 1,
                        flexWrap:
                          "wrap",
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color:
                            "rgba(255,255,255,0.3)",
                        }}
                      >
                        Sources:
                      </Typography>

                      {message.sources.map(
                        (
                          src,
                          i
                        ) => (
                          <Chip
                            key={
                              i
                            }
                            label={`📄 ${src}`}
                            size="small"
                            sx={{
                              fontSize: 10,
                              height: 20,
                              bgcolor:
                                "rgba(108,99,255,0.1)",
                              color:
                                "#a09cff",
                            }}
                          />
                        )
                      )}
                    </Box>
                  )}
              </Box>
            )
          )} */}
{/* 
          <div
            ref={
              bottomRef
            }
          />
        </Box> */}

        {/* INPUT */}

        <Box
          sx={{
            flexShrink: 0,
            p: 2,
            borderTop:
              "1px solid rgba(108,99,255,0.12)",
            bgcolor:
              "#0d0d18",
          }}
        >
          <Box
            sx={{
              display:
                "flex",
              gap: 1,
              alignItems:
                "flex-end",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={input}
              onChange={(
                e
              ) =>
                setInput(
                  e.target
                    .value
                )
              }
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                    "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();

                  handleSend();
                }
              }}
              placeholder="Ask anything from your notes..."
              sx={{
                "& .MuiOutlinedInput-root":
                  {
                    bgcolor:
                      "rgba(255,255,255,0.04)",
                    color:
                      "#fff",
                    borderRadius:
                      "12px",

                    "& fieldset":
                      {
                        borderColor:
                          "rgba(108,99,255,0.2)",
                      },
                  },
              }}
            />

            <Button
              onClick={
                handleSend
              }
              disabled={
                !input.trim() ||
                loading
              }
              sx={{
                minWidth: 48,
                height: 48,
                borderRadius:
                  "12px",
                background:
                  "linear-gradient(135deg,#6C63FF,#8B5CF6)",
                color:
                  "#fff",
              }}
            >
              {loading ? (
                <CircularProgress
                  size={
                    20
                  }
                  sx={{
                    color:
                      "#fff",
                  }}
                />
              ) : (
                <SendIcon />
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;