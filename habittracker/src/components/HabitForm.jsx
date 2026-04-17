// src/components/HabitForm.jsx
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { addHabit, updateHabit } from "../api/habitApi";

import {
  TextField,
  Button,
  MenuItem,
  Box
} from "@mui/material";

function HabitForm({ refresh, editHabit, setEditHabit }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    type: "daily",
    goal_days: 30,
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    if (editHabit) setForm(editHabit);
  }, [editHabit]);

  // 🔥 HANDLE START DATE
  const handleStartDateChange = (value) => {
    if (!value) {
      setForm({ ...form, start_date: "", end_date: "" });
      return;
    }

    const start = dayjs(value);

    const end = start
      .add(Number(form.goal_days) - 1, "day")
      .format("YYYY-MM-DD");

    setForm({
      ...form,
      start_date: start.format("YYYY-MM-DD"),
      end_date: end
    });
  };

  // 🔥 HANDLE GOAL DAYS
  const handleGoalChange = (value) => {
    const goal = Number(value);

    if (!form.start_date) {
      setForm({ ...form, goal_days: goal });
      return;
    }

    const start = dayjs(form.start_date);

    const end = start
      .add(goal - 1, "day")
      .format("YYYY-MM-DD");

    setForm({
      ...form,
      goal_days: goal,
      end_date: end
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_date || !form.end_date) {
      alert("Please select valid dates ❌");
      return;
    }

    if (editHabit) {
      await updateHabit(editHabit.id, form);
      setEditHabit(null);
    } else {
      await addHabit({ ...form, user_id: user.id });
    }

    setForm({
      title: "",
      type: "daily",
      goal_days: 30,
      start_date: "",
      end_date: ""
    });

    refresh();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box component="form" onSubmit={handleSubmit}>

        {/* 🔹 ROW 1 */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            mb: 2
          }}
        >
          {/* HABIT NAME */}
          <TextField
            label="Habit Name"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            sx={{ width: 250 }}
          />

          {/* FREQUENCY */}
          <TextField
            select
            label="Frequency"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            sx={{ width: 140 }}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </TextField>

          {/* DAYS */}
          <TextField
            label="Days"
            type="number"
            value={form.goal_days}
            onChange={(e) => handleGoalChange(e.target.value)}
            sx={{ width: 120 }}
            inputProps={{ min: 1 }}
          />
        </Box>

        {/* 🔹 ROW 2 */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center"
          }}
        >
          {/* START DATE */}
          <TextField
            label="Start Date"
            type="date"
            value={form.start_date || ""}
            onChange={(e) =>
              handleStartDateChange(e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: dayjs().format("YYYY-MM-DD") // 🔥 no past date
            }}
            sx={{ width: 180 }}
          />

          {/* END DATE (AUTO) */}
          <TextField
            label="End Date"
            type="date"
            value={form.end_date || ""}
            InputLabelProps={{ shrink: true }}
            disabled // 🔥 cannot edit manually
            sx={{ width: 180 }}
          />

          {/* BUTTON */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              borderRadius: "8px",
              px: 3,
              height: "56px",
              whiteSpace: "nowrap",
              "&:hover": {
                backgroundColor: "#43A047"
              }
            }}
          >
            {editHabit ? "Update Habit" : "Add Habit"}
          </Button>
        </Box>

      </Box>
    </motion.div>
  );
}

export default HabitForm;