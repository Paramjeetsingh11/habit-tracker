// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { getHabits, getLogs, getStreak } from "../api/habitApi";
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
  Grid,
  Select,
  MenuItem,
  LinearProgress
} from "@mui/material";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [editHabit, setEditHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [completionRate, setCompletionRate] = useState(0);

  const [streak, setStreak] = useState({
    currentStreak: 0,
    longestStreak: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ FETCH HABITS
  const fetchHabits = async () => {
    const res = await getHabits(user.id);
    setHabits(res.data);

    if (res.data.length > 0 && !selectedHabit) {
      setSelectedHabit(res.data[0]);
    }
  };

  // ✅ FETCH LOGS + FIXED COMPLETION %
  const fetchLogs = async (habitId, habit) => {
    if (!habitId) return;

    try {
      const res = await getLogs(habitId);
      const data = res.data;

      setLogs(data);

      // 🔥 TOTAL DAYS (GOAL BASED)
      const totalDays = habit?.goal_days || 0;

      // 🔥 COMPLETED DAYS
      const completedDays = data.filter(
        (log) => log.status === "completed"
      ).length;

      // ✅ CORRECT %
      const rate =
        totalDays === 0
          ? 0
          : Math.round((completedDays / totalDays) * 100);

      setCompletionRate(rate);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH STREAK
  const fetchStreak = async (habitId) => {
    if (!habitId) return;

    try {
      const res = await getStreak(habitId);
      setStreak(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchHabits();
  }, []);

  // 🔥 UPDATE WHEN HABIT CHANGES
  useEffect(() => {
    if (selectedHabit) {
      fetchLogs(selectedHabit.id, selectedHabit);
      fetchStreak(selectedHabit.id);
    }
  }, [selectedHabit]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F7FA", py: 4 }}>
      <Container maxWidth="lg">

        <Grid container spacing={3}>

          {/* LEFT SIDE */}
          <Grid item xs={12} md={8}>

            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Dashboard 📊
              </Typography>
            </motion.div>

            {/* STATS */}
            <Grid container spacing={3} sx={{ mb: 3 }}>

              {/* ACTIVE HABITS */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={cardStyle}>
                  <Typography color="text.secondary">Active Habits</Typography>
                  <Typography variant="h4">{habits.length}</Typography>
                </Paper>
              </Grid>

              {/* COMPLETION RATE */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={cardStyle}>
                  <Typography color="text.secondary">Completion Rate</Typography>

                  <Typography variant="h4" sx={{ color: "#4CAF50" }}>
                    {completionRate}%
                  </Typography>

                  {/* 🔥 EXTRA INFO */}
                  <Typography variant="body2">
                    {logs.filter(l => l.status === "completed").length} / {selectedHabit?.goal_days || 0} days
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={progressGreen}
                  />
                </Paper>
              </Grid>

              {/* CURRENT STREAK */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={cardStyle}>
                  <Typography color="text.secondary">Current Streak</Typography>
                  <Typography variant="h4">
                    🔥 {streak.currentStreak}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(streak.currentStreak * 10, 100)}
                    sx={progressOrange}
                  />
                </Paper>
              </Grid>

              {/* LONGEST STREAK */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={cardStyle}>
                  <Typography color="text.secondary">Longest Streak</Typography>
                  <Typography variant="h4" sx={{ color: "#4CAF50" }}>
                    {streak.longestStreak}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(streak.longestStreak * 10, 100)}
                    sx={progressGreen}
                  />
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

            {/* HABIT LIST */}
            <Paper sx={{ ...sectionStyle, mt: 16, width: "160%" }}>
              <Typography variant="h6" mb={2}>
                Your Habits
              </Typography>

              <HabitList
                habits={habits}
                refresh={fetchHabits}
                setEditHabit={setEditHabit}
              />
            </Paper>

            {/* CHART */}
            <Paper sx={sectionStyle}>
              <Typography variant="h6" mb={2}>
                Progress Chart
              </Typography>
              <PieChartView logs={logs} />
            </Paper>

          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ ...sectionStyle, p: 2 }}>
              <Typography variant="h6" mb={2}>
                Activity Calendar
              </Typography>

              <Select
                fullWidth
                value={selectedHabit?.id || ""}
                onChange={(e) => {
                  const habit = habits.find(h => h.id === e.target.value);
                  setSelectedHabit(habit);
                }}
                sx={{ mb: 2 }}
              >
                {habits.map((habit) => (
                  <MenuItem key={habit.id} value={habit.id}>
                    {habit.title}
                  </MenuItem>
                ))}
              </Select>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MUICalendar
                  logs={logs}
                  setLogs={(updatedLogs) => {
                    setLogs(updatedLogs);

                    // 🔥 REAL-TIME % UPDATE
                    const completedDays = updatedLogs.filter(
                      (log) => log.status === "completed"
                    ).length;

                    const totalDays = selectedHabit?.goal_days || 0;

                    const rate =
                      totalDays === 0
                        ? 0
                        : Math.round((completedDays / totalDays) * 100);

                    setCompletionRate(rate);
                  }}
                  habitId={selectedHabit?.id}
                  startDate={selectedHabit?.start_date}
                  endDate={selectedHabit?.end_date}
                  refreshStreak={fetchStreak}
                  streak={streak}
                />
              </Box>
            </Paper>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}

/* STYLES */
const cardStyle = {
  p: 3,
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const sectionStyle = {
  p: 3,
  mb: 3,
  borderRadius: "12px"
};

const progressGreen = {
  mt: 1,
  height: 8,
  borderRadius: 5,
  backgroundColor: "#eee",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#4CAF50",
  },
};

const progressOrange = {
  mt: 1,
  height: 8,
  borderRadius: 5,
  backgroundColor: "#eee",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#ff5722",
  },
};

export default Dashboard;