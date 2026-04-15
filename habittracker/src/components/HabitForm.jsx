// src/components/HabitForm.jsx
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
    goal_days: 30,
    start_date: "",
    end_date: ""
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
            onChange={(e) =>
              setForm({ ...form, goal_days: e.target.value })
            }
            sx={{ width: 120 }}
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
              setForm({ ...form, start_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />

          {/* END DATE */}
          <TextField
            label="End Date"
            type="date"
            value={form.end_date || ""}
            onChange={(e) =>
              setForm({ ...form, end_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
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