import {
  useMemo,
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
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import { useAuth } from "../contexts/AuthContext";

function Register() {
  const navigate =
    useNavigate();

  const { register } =
    useAuth();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [confirm,
    setConfirm] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  const strength =
    useMemo(() => {
      if (
        password.length >= 12
      )
        return 100;

      if (
        password.length >= 10
      )
        return 80;

      if (
        password.length >= 8
      )
        return 60;

      if (
        password.length >= 6
      )
        return 40;

      if (
        password.length >= 4
      )
        return 20;

      return 0;
    }, [password]);

  const strengthLabel =
    useMemo(() => {
      if (strength >= 80)
        return "Strong";

      if (strength >= 60)
        return "Good";

      if (strength >= 40)
        return "Medium";

      if (strength >= 20)
        return "Weak";

      return "Very Weak";
    }, [strength]);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !name ||
        !email ||
        !password
      ) {
        return setError(
          "Please fill all fields"
        );
      }

      if (
        password !==
        confirm
      ) {
        return setError(
          "Passwords do not match"
        );
      }

      if (
        password.length < 6
      ) {
        return setError(
          "Password must be at least 6 characters"
        );
      }

      setLoading(true);
      setError("");

      try {
        const result =
          await register(
            name,
            email,
            password
          );

        if (
          result.success
        ) {
          alert(
            "Registration successful! Welcome to NexaMind AI."
          );

          navigate(
            "/dashboard"
          );
        } else {
          setError(
            result.message ||
              "Registration failed"
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
          alignItems:
            "center",
          justifyContent:
            "center",
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
            top: -120,
            left: -120,
          }}
        />

        <Box
          sx={{
            zIndex: 2,
            maxWidth: 520,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color:
                "white",
              fontWeight: 800,
              mb: 3,
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
              lineHeight: 1.3,
            }}
          >
            Build your
            intelligent
            AI-powered
            knowledge
            workspace.
          </Typography>
        </Box>
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
            Create account
          </Typography>

          <Typography
            sx={{
              color:
                "#9CA3AF",
              mb: 4,
            }}
          >
            Start using
            NexaMind AI
            today
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
                label="Full Name"
                fullWidth
                value={name}
                onChange={(
                  e
                ) =>
                  setName(
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

              <Box>
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

                <Box
                  sx={{
                    mt: 1.5,
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={
                      strength
                    }
                    sx={{
                      height: 8,
                      borderRadius:
                        999,
                      bgcolor:
                        "#1F2937",
                    }}
                  />

                  <Typography
                    sx={{
                      mt: 1,
                      color:
                        "#9CA3AF",
                      fontSize: 13,
                    }}
                  >
                    Password
                    strength:
                    {" "}
                    {
                      strengthLabel
                    }
                  </Typography>
                </Box>
              </Box>

              <TextField
                label="Confirm Password"
                fullWidth
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                value={
                  confirm
                }
                onChange={(
                  e
                ) =>
                  setConfirm(
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
                            setShowConfirm(
                              !showConfirm
                            )
                          }
                        >
                          {showConfirm ? (
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
                  "Create Account"
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
            Already have
            an account?{" "}
            <Link
              to="/login"
              style={{
                color:
                  "#8B5CF6",
                textDecoration:
                  "none",
                fontWeight: 700,
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;