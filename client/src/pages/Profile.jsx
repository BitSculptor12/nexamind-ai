import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
} from "@mui/material";

import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { user, updateUser } = useAuth();

  const storedUser = user || JSON.parse(
    localStorage.getItem("nexamind_user") || "{}"
  );

  const [name, setName] = useState(storedUser.name || "");
  const [email] = useState(storedUser.email || "");
  const [bio, setBio] = useState(storedUser.bio || "");
  const [profileImage, setProfileImage] = useState(storedUser.profileImage || "");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedUser = {
      ...storedUser,
      name,
      email,
      bio,
      profileImage,
    };

    localStorage.setItem("nexamind_user", JSON.stringify(updatedUser));
    if (typeof updateUser === "function") updateUser(updatedUser);

    alert("Profile Updated");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#080810",
        color: "white",
        p: 4
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={4}>
        Profile Settings
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: 5,
          border: "1px solid rgba(108,99,255,0.12)",
          background: "#0d0d18",
          maxWidth: 700
        }}
      >
        <Stack spacing={4}>
          <Stack alignItems="center" spacing={2}>
            <Avatar
              src={profileImage}
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
                bgcolor: "#6C63FF"
              }}
            >
              {name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Button variant="outlined" component="label">
              Upload Profile Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </Button>
          </Stack>

          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.04)",
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.35)",
              }
            }}
          />

          <TextField
            label="Email"
            value={email}
            disabled
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.04)",
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.35)",
              }
            }}
          />

          <TextField
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.04)",
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.35)",
              }
            }}
          />

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: "linear-gradient(135deg,#6C63FF,#8B5CF6)",
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Profile;