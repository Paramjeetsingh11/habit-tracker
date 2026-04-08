import { deleteHabit } from "../api/habitApi";
import { motion } from "framer-motion";

function HabitList({ habits, refresh, setEditHabit }) {

  const handleDelete = async (id) => {
    await deleteHabit(id);
    refresh();
  };

  return (
    <div style={styles.grid}>
      {habits.map((h) => (
        <motion.div
          key={h.id}
          style={styles.card}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>{h.title}</h3>
          <p>{h.type} • {h.goal_days} days</p>

          <div>
            <button onClick={() => setEditHabit(h)}>✏️</button>
            <button onClick={() => handleDelete(h.id)}>🗑️</button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  },
  card: {
    background: "#fff",
    color: "#000",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)"
  }
};

export default HabitList;