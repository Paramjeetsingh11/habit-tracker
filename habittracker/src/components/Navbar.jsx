import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // refresh UI
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#333",
        borderBottom: "1px solid #e0e0e0"
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LOGO */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            fontWeight: "bold",
            color: "#4CAF50"
          }}
        >
          HabitTracker
        </Typography>

        {/* CENTER NAV */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button component={Link} to="/" sx={{ color: "#333" }}>
            Home
          </Button>

          {/* ✅ SHOW DASHBOARD ONLY WHEN LOGGED IN */}
          {user && (
            <Button component={Link} to="/dashboard" sx={{ color: "#333" }}>
              Dashboard
            </Button>
          )}
        </Box>

        {/* RIGHT SIDE */}
        <Box sx={{ display: "flex", gap: 2 }}>

          {/* NOT LOGGED IN */}
          {!user && (
            <>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  borderRadius: "8px"
                }}
              >
                Sign In
              </Button>

              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF50",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#43A047" }
                }}
              >
                Sign Up
              </Button>
            </>
          )}

          {/* LOGGED IN */}
          {user && (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#f44336",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#d32f2f" }
              }}
            >
              Logout
            </Button>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;