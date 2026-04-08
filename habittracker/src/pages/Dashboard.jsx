// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { getHabits, getLogs } from "../api/habitApi";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import MUICalendar from "../components/MUICalendar";
import { motion } from "framer-motion";
import PieChartView from "../components/PieChartView";

// ✅ MUI IMPORTS
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid
} from "@mui/material";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [editHabit, setEditHabit] = useState(null);
  const [logs, setLogs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchHabits = async () => {
    const res = await getHabits(user.id);
    setHabits(res.data);
  };

  const fetchLogs = async () => {
    try {
      const res = await getLogs(1); // temporary habit id
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHabits();
    fetchLogs();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        py: 4
      }}
    >
      <Container maxWidth="lg">

        {/* Heading */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            🚀 Smart Habit Tracker
          </Typography>
        </motion.div>

        {/* 🔥 ANALYTICS CARDS (NEW) */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6">Active Habits</Typography>
              <Typography variant="h4">{habits.length}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6">Completion Rate</Typography>
              <Typography variant="h4" color="error">
                24%
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6">Current Streak</Typography>
              <Typography variant="h4" color="warning.main">
                0
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              <Typography variant="h6">Longest Streak</Typography>
              <Typography variant="h4" color="success.main">
                11
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Form */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3
            }}
          >
            <HabitForm
              refresh={fetchHabits}
              editHabit={editHabit}
              setEditHabit={setEditHabit}
            />
          </Paper>
        </motion.div>

        {/* Habit List */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3
          }}
        >
          <HabitList
            habits={habits}
            refresh={fetchHabits}
            setEditHabit={setEditHabit}
          />
        </Paper>

        {/* 🔥 CHART SECTION (NEW) */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            display: "flex",
            justifyContent: "center"
          }}
        >
          <PieChartView />
        </Paper>

        {/* Calendar */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 3
          }}
        >
          <MUICalendar logs={logs} />
        </Paper>

      </Container>
    </Box>
  );
}

export default Dashboard;