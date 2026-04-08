import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { addHabit, updateHabit } from "../api/habitApi";

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
    <motion.form
      onSubmit={handleSubmit}
      style={styles.form}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <input
        placeholder="Habit name"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <input
        type="number"
        value={form.goal_days}
        onChange={(e) => setForm({ ...form, goal_days: e.target.value })}
      />

      <button type="submit">
        {editHabit ? "Update Habit" : "Add Habit"}
      </button>
    </motion.form>
  );
}

const styles = {
  form: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  }
};

export default HabitForm;