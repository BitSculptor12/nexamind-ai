
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Chip
} from "@mui/material";

import CheckCircleRoundedIcon
from "@mui/icons-material/CheckCircleRounded";

import AutoAwesomeRoundedIcon
from "@mui/icons-material/AutoAwesomeRounded";

import axios from "axios";

function Pricing() {


const handleUpgrade =
async () => {

  try {

    const res =
    await axios.post(

      "http://localhost:5000/api/payment/create-order"
    );

    const order =
    res.data;

    const options = {

      key:
      import.meta.env
      .VITE_RAZORPAY_KEY,

      amount:
      order.amount,

      currency:
      order.currency,

      name:
      "NexaMind AI",

      description:
      "Pro Subscription",

      order_id:
      order.id,

      theme: {
        color:
        "#6C63FF"
      },

      handler:
      function () {

        alert(
          "Payment Success"
        );

        localStorage.setItem(

          "nexamind_plan",

          "pro"
        );
      }
    };

    const razorpay =
    new window.Razorpay(
      options
    );

    razorpay.open();

  } catch (error) {

    console.log(error);

    alert(
      "Payment failed"
    );
  }
};



  return (

    <Box>

      <Typography
        variant="h3"
        fontWeight={700}
        mb={1}
      >
        Pricing Plans
      </Typography>

      <Typography
        color="text.secondary"
        mb={5}
      >
        Upgrade your AI workspace
        with premium capabilities.
      </Typography>

      <Grid
        container
        spacing={4}
      >

        {/* FREE PLAN */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 6,
              border:
              "1px solid #E5E7EB",
              height: "100%"
            }}
          >

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Free
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              mt={3}
            >
              ₹0
            </Typography>

            <Typography
              color="text.secondary"
              mb={4}
            >
              Forever free
            </Typography>

            <Stack spacing={2}>

              {[
                "Basic AI Chat",
                "5 document uploads",
                "Limited AI memory",
                "Community support"
              ].map((item) => (

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  key={item}
                >

                  <CheckCircleRoundedIcon
                    color="success"
                  />

                  <Typography>
                    {item}
                  </Typography>

                </Stack>
              ))}

            </Stack>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 5,
                py: 1.6,
                borderRadius: 4
              }}
            >
              Current Plan
            </Button>

          </Paper>

        </Grid>

        {/* PRO PLAN */}

        <Grid
          item
          xs={12}
          md={6}
        >

          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 6,
              border:
              "2px solid #6C63FF",
              position: "relative",
              overflow: "hidden"
            }}
          >

            <Chip

              label="MOST POPULAR"

              color="primary"

              icon={
                <AutoAwesomeRoundedIcon />
              }

              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                fontWeight: 700
              }}
            />

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Pro
            </Typography>

            <Typography
              variant="h3"
              fontWeight={800}
              mt={3}
            >
              ₹499
            </Typography>

            <Typography
              color="text.secondary"
              mb={4}
            >
              per month
            </Typography>

            <Stack spacing={2}>

              {[
                "Unlimited AI Chat",
                "Unlimited uploads",
                "Knowledge Graph",
                "AI Memory",
                "Research Mode",
                "Team Workspace",
                "Priority AI speed",
                "Premium support"
              ].map((item) => (

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  key={item}
                >

                  <CheckCircleRoundedIcon
                    color="success"
                  />

                  <Typography>
                    {item}
                  </Typography>

                </Stack>
              ))}

            </Stack>

            <Button

              fullWidth

              variant="contained"

              onClick={
                handleUpgrade
              }

              sx={{
                mt: 5,
                py: 1.8,
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 16,
                background:
                "linear-gradient(135deg,#6C63FF,#8B5CF6)"
              }}
            >

              Upgrade to Pro

            </Button>

          </Paper>

        </Grid>

      </Grid>

    </Box>
  );
}

export default Pricing;

