// src/pages/Dashboard.js

import { useEffect, useState } from "react";
import { getHabits, getLogs } from "../api/habitApi";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import MUICalendar from "../components/MUICalendar";
import PieChartView from "../components/PieChartView";
import { motion } from "framer-motion";

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
      const res = await getLogs(1);
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
        backgroundColor: "#F5F7FA",
        py: 4
      }}
    >
      <Container maxWidth="lg">

        {/* HEADING */}
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard 📊
          </Typography>
        </motion.div>

        {/* STATS */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={cardStyle}>
              <Typography color="text.secondary">Active Habits</Typography>
              <Typography variant="h4">{habits.length}</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={cardStyle}>
              <Typography color="text.secondary">Completion Rate</Typography>
              <Typography variant="h4" sx={{ color: "#4CAF50" }}>
                24%
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={cardStyle}>
              <Typography color="text.secondary">Current Streak</Typography>
              <Typography variant="h4">0</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper sx={cardStyle}>
              <Typography color="text.secondary">Longest Streak</Typography>
              <Typography variant="h4" sx={{ color: "#4CAF50" }}>
                11
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* FORM */}
        <Paper sx={sectionStyle}>
          <Typography variant="h6" mb={2}>
            Add / Edit Habit
          </Typography>

          <HabitForm
            refresh={fetchHabits}
            editHabit={editHabit}
            setEditHabit={setEditHabit}
          />
        </Paper>

        {/* LIST */}
        <Paper sx={sectionStyle}>
          <Typography variant="h6" mb={2}>
            Your Habits
          </Typography>

          <HabitList
            habits={habits}
            refresh={fetchHabits}
            setEditHabit={setEditHabit}
          />
        </Paper>

        {/* CHART + CALENDAR */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={sectionStyle}>
              <Typography variant="h6" mb={2}>
                Progress Chart
              </Typography>
              <PieChartView />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={sectionStyle}>
              <Typography variant="h6" mb={2}>
                Activity Calendar
              </Typography>
              <MUICalendar logs={logs} />
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}

/* COMMON STYLES */
const cardStyle = {
  p: 3,
  borderRadius: "12px",
  textAlign: "center"
};

const sectionStyle = {
  p: 3,
  mb: 3,
  borderRadius: "12px"
};

export default Dashboard;