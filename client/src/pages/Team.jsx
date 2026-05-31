
import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton
} from "@mui/material";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";


// =========================
// TEAM WORKSPACE
// =========================

function Team() {

  const [teams,
  setTeams] =
  useState([]);

  const [open,
  setOpen] =
  useState(false);

  const [teamName,
  setTeamName] =
  useState("");

  const [inviteEmail,
  setInviteEmail] =
  useState("");


  // =========================
  // LOAD TEAMS
  // =========================

  useEffect(() => {

    const saved =
    JSON.parse(

      localStorage.getItem(
        "nexamind_teams"
      ) || "[]"
    );

    setTeams(saved);

  }, []);


  // =========================
  // SAVE
  // =========================

  const saveTeams =
  (items) => {

    localStorage.setItem(

      "nexamind_teams",

      JSON.stringify(items)
    );

    setTeams(items);
  };


  // =========================
  // CREATE TEAM
  // =========================

  const handleCreateTeam =
  () => {

    if (!teamName) return;

    const newTeam = {

      id: Date.now(),

      name: teamName,

      members: [],

      createdAt:
      new Date().toLocaleString()
    };

    saveTeams([
      newTeam,
      ...teams
    ]);

    setTeamName("");

    setOpen(false);
  };


  // =========================
  // INVITE MEMBER
  // =========================

  const handleInvite =
  (teamId) => {

    if (!inviteEmail) return;

    const updated =
    teams.map((team) => {

      if (team.id === teamId) {

        return {

          ...team,

          members: [

            ...team.members,

            {
              email:
              inviteEmail,

              role:
              "Member"
            }
          ]
        };
      }

      return team;
    });

    saveTeams(updated);

    setInviteEmail("");
  };


  // =========================
  // DELETE TEAM
  // =========================

  const handleDelete =
  (id) => {

    const updated =
    teams.filter(

      team => team.id !== id
    );

    saveTeams(updated);
  };


  return (

    <Box>

      {/* =====================
          HEADER
      ====================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
        mb={4}
      >

        <Box>

          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 800
            }}
          >
            Team Workspace
          </Typography>

          <Typography
            sx={{
              color: "#9CA3AF",
              mt: 1
            }}
          >
            Collaborate with your AI teams
          </Typography>

        </Box>

        <Button

          variant="contained"

          startIcon={
            <AddRoundedIcon />
          }

          onClick={() =>
            setOpen(true)
          }

          sx={{

            py: 1.4,

            px: 3,

            borderRadius: 3,

            fontWeight: 700,

            background:
            "linear-gradient(135deg,#6C63FF,#9D4DFF)"
          }}
        >

          Create Team

        </Button>

      </Stack>


      {/* =====================
          EMPTY STATE
      ====================== */}

      {teams.length === 0 && (

        <Paper
          elevation={0}
          sx={{

            p: 8,

            borderRadius: 5,

            textAlign: "center",

            bgcolor: "#11111B",

            border:
            "1px solid rgba(255,255,255,0.06)"
          }}
        >

          <GroupsRoundedIcon
            sx={{
              fontSize: 80,
              color: "#6C63FF",
              mb: 2
            }}
          />

          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: 24,
              mb: 1
            }}
          >
            No Teams Created
          </Typography>

          <Typography
            sx={{
              color: "#9CA3AF"
            }}
          >
            Create your first AI collaboration workspace
          </Typography>

        </Paper>
      )}


      {/* =====================
          TEAM GRID
      ====================== */}

      <Grid
        container
        spacing={3}
      >

        {teams.map((team) => (

          <Grid
            item
            xs={12}
            lg={6}
            key={team.id}
          >

            <Paper
              elevation={0}
              sx={{

                p: 4,

                borderRadius: 5,

                bgcolor: "#11111B",

                border:
                "1px solid rgba(255,255,255,0.06)"
              }}
            >

              {/* TEAM HEADER */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >

                  <Avatar
                    sx={{
                      bgcolor: "#6C63FF"
                    }}
                  >

                    <GroupsRoundedIcon />

                  </Avatar>

                  <Box>

                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: 22
                      }}
                    >

                      {team.name}

                    </Typography>

                    <Typography
                      sx={{
                        color: "#9CA3AF",
                        fontSize: 13
                      }}
                    >

                      {team.createdAt}

                    </Typography>

                  </Box>

                </Stack>

                <IconButton
                  onClick={() =>
                    handleDelete(team.id)
                  }
                  sx={{
                    color: "#FF5A5A"
                  }}
                >

                  <DeleteRoundedIcon />

                </IconButton>

              </Stack>


              {/* MEMBERS */}

              <Stack spacing={2}>

                {team.members.map((member, index) => (

                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#1A1A2B"
                    }}
                  >

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >

                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >

                        <Avatar>
                          {
                            member.email
                            ?.charAt(0)
                            ?.toUpperCase()
                          }
                        </Avatar>

                        <Box>

                          <Typography
                            sx={{
                              color: "white"
                            }}
                          >

                            {member.email}

                          </Typography>

                          <Typography
                            sx={{
                              color: "#9CA3AF",
                              fontSize: 13
                            }}
                          >

                            {member.role}

                          </Typography>

                        </Box>

                      </Stack>

                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                      />

                    </Stack>

                  </Paper>
                ))}

              </Stack>


              {/* INVITE */}

              <Stack
                direction="row"
                spacing={2}
                mt={4}
              >

                <TextField

                  fullWidth

                  placeholder=
                  "Invite member email"

                  value={inviteEmail}

                  onChange={(e) =>
                    setInviteEmail(
                      e.target.value
                    )
                  }

                  sx={{

                    "& .MuiOutlinedInput-root": {

                      color: "white",

                      borderRadius: 3,

                      bgcolor: "#1A1A2B"
                    }
                  }}
                />

                <Button

                  variant="contained"

                  startIcon={
                    <EmailRoundedIcon />
                  }

                  onClick={() =>
                    handleInvite(team.id)
                  }

                  sx={{

                    borderRadius: 3,

                    background:
                    "linear-gradient(135deg,#6C63FF,#9D4DFF)"
                  }}
                >

                  Invite

                </Button>

              </Stack>


              {/* FOOTER */}

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                mt={4}
              >

                <WorkspacePremiumRoundedIcon
                  sx={{
                    color: "#FFD700"
                  }}
                />

                <Typography
                  sx={{
                    color: "#9CA3AF"
                  }}
                >
                  Team collaboration enabled
                </Typography>

              </Stack>

            </Paper>

          </Grid>
        ))}

      </Grid>


      {/* =====================
          CREATE DIALOG
      ====================== */}

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Create Team
        </DialogTitle>

        <DialogContent>

          <TextField

            fullWidth

            label="Team Name"

            value={teamName}

            onChange={(e) =>
              setTeamName(
                e.target.value
              )
            }

            sx={{
              mt: 2
            }}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleCreateTeam
            }
          >
            Create
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default Team;

