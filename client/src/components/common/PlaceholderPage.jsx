import { Box, Paper, Typography } from "@mui/material";

function PlaceholderPage({ title, emoji = "🛠️" }) {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center"
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 720,
          textAlign: "center",
          bgcolor: "#0d0d18",
          borderRadius: 4,
          border: "1px solid rgba(108,99,255,0.12)"
        }}
      >
        <Typography fontSize={54}>{emoji}</Typography>
        <Typography variant="h4" fontWeight={800} mt={1}>
          {title}
        </Typography>
        <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.65)" }}>
          This section is ready for your next workflow layer.
        </Typography>
      </Paper>
    </Box>
  );
}

export default PlaceholderPage;