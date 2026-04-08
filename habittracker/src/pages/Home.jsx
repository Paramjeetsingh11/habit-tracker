import { Container, Typography, Grid, Paper, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>

      {/* 🔥 HERO SECTION */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Build Better Habits, One Day at a Time 🚀
        </Typography>

        <Typography variant="h6" color="text.secondary" mb={3}>
          Smart Habit Tracker helps you stay consistent, track progress,
          and achieve your personal goals effortlessly.
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#43A047" }
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* 📊 FEATURES SECTION */}
      <Grid container spacing={4} mb={6} justifyContent={"center"}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              📅 Smart Tracking
            </Typography>
            <Typography color="text.secondary">
              Easily track your daily and weekly habits with a clean and
              intuitive interface designed for consistency.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              🔥 Streak System
            </Typography>
            <Typography color="text.secondary">
              Stay motivated by building streaks. The longer your streak,
              the stronger your habit becomes.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              📊 Progress Insights
            </Typography>
            <Typography color="text.secondary">
              Visualize your progress with charts and analytics to understand
              your growth over time.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 💡 WHY SECTION */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Why Use Smart Habit Tracker?
        </Typography>

        <Typography color="text.secondary" maxWidth="700px" mx="auto">
          Success is built on small daily actions. Our system helps you stay
          accountable, focused, and disciplined by turning your goals into
          achievable habits. Whether it's fitness, study, or productivity —
          we help you stay on track.
        </Typography>
      </Box>

      {/* 🎯 CTA SECTION */}
      <Box
        textAlign="center"
        sx={{
          p: 5,
          backgroundColor: "#E8F5E9",
          borderRadius: "12px"
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Start Your Habit Journey Today 💪
        </Typography>

        <Typography color="text.secondary" mb={2}>
          Join now and take control of your daily routine.
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            borderRadius: "8px",
            px: 4,
            "&:hover": { backgroundColor: "#43A047" }
          }}
        >
          Create Free Account
        </Button>
      </Box>

    </Container>
  );
}

export default Home;