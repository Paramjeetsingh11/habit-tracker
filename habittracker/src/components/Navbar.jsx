import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
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

        {/* 🔹 LEFT: LOGO */}
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

        {/* 🔹 CENTER: LINKS */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Button
            component={Link}
            to="/"
            sx={{ color: "#333", textTransform: "none" }}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/about"
            sx={{ color: "#333", textTransform: "none" }}
          >
            About Us
          </Button>
        </Box>

        {/* 🔹 RIGHT: AUTH BUTTONS */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              borderColor: "#4CAF50",
              color: "#4CAF50",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#E8F5E9",
                borderColor: "#4CAF50"
              }
            }}
          >
            Sign In
          </Button>

          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#43A047"
              }
            }}
          >
            Sign Up
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;