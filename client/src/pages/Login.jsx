import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !email ||
        !password
      ) {
        return setError(
          "Please fill all fields"
        );
      }

      setLoading(true);
      setError("");

      try {
        const result =
          await login(
            email,
            password
          );

        if (
          result.success
        ) {
          alert(
            "Login successful! Welcome back."
          );

          navigate(
            "/dashboard"
          );
        } else {
          setError(
            result.message ||
              "Login failed"
          );
        }
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Server error. Make sure backend is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Box
      sx={{
        minHeight:
          "100vh",
        display: "flex",
        bgcolor:
          "#080810",
      }}
    >
      {/* LEFT PANEL */}

      <Box
        sx={{
          flex: 1,
          display: {
            xs: "none",
            md: "flex",
          },
          flexDirection:
            "column",
          justifyContent:
            "center",
          px: 10,
          position:
            "relative",
          overflow:
            "hidden",
          background:
            "radial-gradient(circle at top left,#7C4DFF 0%,#080810 55%)",
        }}
      >
        <Box
          sx={{
            position:
              "absolute",
            width: 500,
            height: 500,
            borderRadius:
              "50%",
            background:
              "rgba(124,77,255,0.25)",
            filter:
              "blur(120px)",
            top: -100,
            left: -100,
          }}
        />

        <Typography
          variant="h2"
          sx={{
            color:
              "white",
            fontWeight: 800,
            mb: 2,
            zIndex: 2,
          }}
        >
          NexaMind AI
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color:
              "#E5E7EB",
            fontWeight: 700,
            maxWidth: 520,
            lineHeight: 1.3,
            mb: 5,
            zIndex: 2,
          }}
        >
          Your AI-powered
          second brain
          for research,
          memory and
          intelligent
          knowledge
          management.
        </Typography>

        <List
          sx={{
            zIndex: 2,
          }}
        >
          {[
            "AI-powered document intelligence",
            "Semantic memory & vector search",
            "Collaborative knowledge workspace",
          ].map(
            (
              item
            ) => (
              <ListItem
                key={
                  item
                }
                sx={{
                  px: 0,
                }}
              >
                <ListItemIcon>
                  <CheckCircleRoundedIcon
                    sx={{
                      color:
                        "#8B5CF6",
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={
                    item
                  }
                  primaryTypographyProps={{
                    sx: {
                      color:
                        "#E5E7EB",
                      fontSize: 18,
                    },
                  }}
                />
              </ListItem>
            )
          )}
        </List>
      </Box>

      {/* RIGHT PANEL */}

      <Box
        sx={{
          width: {
            xs: "100%",
            md: 520,
          },
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            p: 5,
            borderRadius:
              5,
            bgcolor:
              "#11111B",
            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color:
                "white",
              fontWeight: 700,
              mb: 1,
            }}
          >
            Welcome back
          </Typography>

          <Typography
            sx={{
              color:
                "#9CA3AF",
              mb: 4,
            }}
          >
            Login to your
            NexaMind
            workspace
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >
            <Stack
              spacing={3}
            >
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(
                  e
                ) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                InputLabelProps={{
                  style: {
                    color:
                      "#9CA3AF",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      color:
                        "white",
                      bgcolor:
                        "#1A1A2B",
                    },
                }}
              />

              <TextField
                label="Password"
                fullWidth
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  e
                ) =>
                  setPassword(
                    e.target
                      .value
                  )
                }
                InputLabelProps={{
                  style: {
                    color:
                      "#9CA3AF",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root":
                    {
                      color:
                        "white",
                      bgcolor:
                        "#1A1A2B",
                    },
                }}
                InputProps={{
                  endAdornment:
                    (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon
                              sx={{
                                color:
                                  "#9CA3AF",
                              }}
                            />
                          ) : (
                            <VisibilityRoundedIcon
                              sx={{
                                color:
                                  "#9CA3AF",
                              }}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={
                  loading
                }
                sx={{
                  py: 1.5,
                  borderRadius:
                    3,
                  fontWeight: 700,
                  fontSize: 16,
                  background:
                    "linear-gradient(135deg,#7C4DFF,#A855F7)",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={
                      24
                    }
                    sx={{
                      color:
                        "white",
                    }}
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Stack>
          </Box>

          <Typography
            sx={{
              color:
                "#9CA3AF",
              mt: 4,
              textAlign:
                "center",
            }}
          >
            Don&apos;t
            have an
            account?{" "}
            <Link
              to="/register"
              style={{
                color:
                  "#8B5CF6",
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              Create
              account
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;