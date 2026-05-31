import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useAuth } from "../contexts/AuthContext";

function Settings() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [hfKey, setHfKey] = useState("");
  const [openAiKey, setOpenAiKey] = useState("");
  const [showHF, setShowHF] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);

  const saveProfile = () => {
    const updated = {
      ...user,
      name,
      email,
      profileImage
    };
    localStorage.setItem("nexamind_user", JSON.stringify(updated));
    updateUser(updated);
    alert("Profile saved");
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 2 }}>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
        {["Profile", "API Keys", "Notifications", "Appearance", "Storage"].map((item) => (
          <Button
            key={item}
            fullWidth
            sx={{
              mb: 1,
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#fff",
              bgcolor: item === "Profile" ? "rgba(108,99,255,0.16)" : "rgba(255,255,255,0.03)",
              borderRadius: 3
            }}
          >
            {item}
          </Button>
        ))}
      </Paper>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Typography variant="h5" fontWeight={900} mb={2}>
            Profile
          </Typography>

          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={profileImage} sx={{ width: 72, height: 72, bgcolor: "#6C63FF" }}>
                {(name || "U").charAt(0).toUpperCase()}
              </Avatar>
              <Button component="label" sx={{ textTransform: "none", fontWeight: 800, color: "#fff", bgcolor: "rgba(108,99,255,0.16)" }}>
                Upload Photo
                <input hidden type="file" accept="image/*" onChange={handleImage} />
              </Button>
            </Stack>

            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" } }}
            />
            <TextField
              label="Email"
              value={email}
              disabled
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" } }}
            />
            <Button onClick={saveProfile} sx={{ width: "fit-content", textTransform: "none", fontWeight: 800, color: "#fff", background: "linear-gradient(135deg, #6C63FF, #8B5CF6)" }}>
              Save Profile
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Typography variant="h5" fontWeight={900} mb={2}>
            API Keys
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="HuggingFace Key"
              type={showHF ? "text" : "password"}
              value={hfKey}
              onChange={(e) => setHfKey(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowHF((s) => !s)} sx={{ color: "#fff" }}>
                    {showHF ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                )
              }}
            />
            <TextField
              label="OpenAI Key"
              type={showOpenAI ? "text" : "password"}
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowOpenAI((s) => !s)} sx={{ color: "#fff" }}>
                    {showOpenAI ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                )
              }}
            />
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Typography variant="h5" fontWeight={900} mb={2}>
            Appearance
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {["Default", "Purple", "Cyan", "Green"].map((chip) => (
              <Chip key={chip} label={chip} sx={{ bgcolor: "rgba(255,255,255,0.04)", color: "#fff" }} />
            ))}
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
          <Typography variant="h5" fontWeight={900} mb={2}>
            Notifications
          </Typography>
          <Stack spacing={1}>
            {["Email alerts", "Push notifications", "Weekly summary", "AI insights"].map((label) => (
              <FormControlLabel key={label} control={<Switch defaultChecked />} label={label} />
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}

export default Settings;