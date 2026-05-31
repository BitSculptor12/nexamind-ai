import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const lineData = [
  { name: "Mon", conversations: 12 },
  { name: "Tue", conversations: 18 },
  { name: "Wed", conversations: 14 },
  { name: "Thu", conversations: 24 },
  { name: "Fri", conversations: 20 },
  { name: "Sat", conversations: 28 },
  { name: "Sun", conversations: 35 }
];

const pieData = [
  { name: "PDF", value: 42 },
  { name: "URL", value: 25 },
  { name: "YouTube", value: 18 },
  { name: "Text", value: 15 }
];

const barData = [
  { name: "Mon", tokens: 3200 },
  { name: "Tue", tokens: 4100 },
  { name: "Wed", tokens: 2900 },
  { name: "Thu", tokens: 5300 },
  { name: "Fri", tokens: 4700 },
  { name: "Sat", tokens: 6200 }
];

const radarData = [
  { topic: "RAG", value: 90 },
  { topic: "Search", value: 78 },
  { topic: "Memory", value: 85 },
  { topic: "Graph", value: 73 },
  { topic: "Study", value: 66 }
];

function Analytics() {
  const cards = [
    { title: "Conversations", value: "1,248", delta: "+18%" },
    { title: "Documents", value: "58", delta: "+11%" },
    { title: "Tokens", value: "92k", delta: "+24%" },
    { title: "Coverage", value: "84%", delta: "+5%" }
  ];

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={2}>
        {["Last 7 Days", "Last 30 Days", "Last 90 Days"].map((item, idx) => (
          <Chip
            key={item}
            label={item}
            sx={{
              bgcolor: idx === 0 ? "rgba(108,99,255,0.16)" : "rgba(255,255,255,0.04)",
              color: "#fff"
            }}
          />
        ))}
      </Stack>

      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.title}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)" }}>
                {c.title}
              </Typography>
              <Typography fontSize={30} fontWeight={900} mt={0.5}>
                {c.value}
              </Typography>
              <Chip size="small" label={c.delta} sx={{ mt: 1, bgcolor: "rgba(16,185,129,0.14)", color: "#10B981" }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.2 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: 380 }}>
            <Typography fontWeight={900} mb={2}>
              Conversation Trend
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="purpleLine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6C63FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                <YAxis stroke="rgba(255,255,255,0.45)" />
                <Tooltip />
                <Area type="monotone" dataKey="conversations" stroke="#6C63FF" fill="url(#purpleLine)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: 380 }}>
            <Typography fontWeight={900} mb={2}>
              Source Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} innerRadius={55} fill="#6C63FF" />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: 360 }}>
            <Typography fontWeight={900} mb={2}>
              Tokens per Day
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={barData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                <YAxis stroke="rgba(255,255,255,0.45)" />
                <Tooltip />
                <Bar dataKey="tokens" fill="#6C63FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)", height: 360 }}>
            <Typography fontWeight={900} mb={2}>
              Knowledge Coverage
            </Typography>
            <ResponsiveContainer width="100%" height="85%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="topic" stroke="rgba(255,255,255,0.55)" />
                <Radar dataKey="value" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.25} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ mt: 2, p: 2.5, borderRadius: 3, bgcolor: "#0d0d18", border: "1px solid rgba(108,99,255,0.12)" }}>
        <Typography fontWeight={900} mb={2}>
          Top Conversations
        </Typography>
        <Stack spacing={1}>
          {[
            ["Research workflow", "24 replies", "93%"],
            ["Document QA", "18 replies", "89%"],
            ["Study Mode", "12 replies", "82%"]
          ].map(([a, b, c]) => (
            <Stack key={a} direction="row" justifyContent="space-between" sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(255,255,255,0.03)" }}>
              <Typography fontWeight={700}>{a}</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.55)" }}>{b}</Typography>
              <Typography fontWeight={800} sx={{ color: "#10B981" }}>
                {c}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

export default Analytics;