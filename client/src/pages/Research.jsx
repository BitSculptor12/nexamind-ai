import {
  Typography,
  Paper
} from "@mui/material";

function Research() {

  return (

    <>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        Research Mode
      </Typography>

      <Paper sx={{ p: 5 }}>

        Contradiction detection,
        semantic search &
        research workflows.

      </Paper>
    </>
  );
}

export default Research;