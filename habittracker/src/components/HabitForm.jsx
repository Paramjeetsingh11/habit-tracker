import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
    goal_days: 30
  });

  useEffect(() => {
    if (editHabit) setForm(editHabit);
  }, [editHabit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editHabit) {
      await updateHabit(editHabit.id, form);
      setEditHabit(null);
    } else {
      await addHabit({ ...form, user_id: user.id });
    }

    setForm({ title: "", type: "daily", goal_days: 30 });
    refresh();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        {/* HABIT NAME */}
        <TextField
          label="Habit Name"
          variant="outlined"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          sx={{ minWidth: 200 }}
        />

        {/* TYPE */}
        <TextField
          select
          label="Frequency"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </TextField>

        {/* DAYS */}
        <TextField
          label="Days"
          type="number"
          value={form.goal_days}
          onChange={(e) =>
            setForm({ ...form, goal_days: e.target.value })
          }
          sx={{ width: 120 }}
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
            "&:hover": {
              backgroundColor: "#43A047"
            }
          }}
        >
          {editHabit ? "Update Habit" : "Add Habit"}
        </Button>
      </Box>
    </motion.div>
  );
}

export default HabitForm;