import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#080810"
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0
        }}
      >
        <Topbar />
        <Box
          component="main"
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto",
            minWidth: 0
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;