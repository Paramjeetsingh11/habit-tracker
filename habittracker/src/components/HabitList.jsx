import { deleteHabit } from "../api/habitApi";
import { motion } from "framer-motion";

function HabitList({ habits, refresh, setEditHabit }) {

  const handleDelete = async (id) => {
    await deleteHabit(id);
    refresh();
  };

  return (
    <div style={styles.page}>
      <div style={styles.grid}>
        {habits.map((h, index) => (
          <motion.div
            key={h.id}
            style={styles.card}

            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}

            whileHover={{ scale: 1.05 }}
          >
            <div style={styles.glow}></div>

            <h3 style={styles.title}>{h.title}</h3>
            <p style={styles.text}>
              {h.type} • {h.goal_days} days
            </p>

            <div style={styles.actions}>
              <motion.button
                whileTap={{ scale: 0.8 }}
                style={styles.editBtn}
                onClick={() => setEditHabit(h)}
              >
                ✏️
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.8 }}
                style={styles.deleteBtn}
                onClick={() => handleDelete(h.id)}
              >
                🗑️
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  // 🔥 FULL PAGE BACKGROUND
  page: {
    minHeight: "30vh",
    background: "white",
    padding: "20px"
  },

  // GRID
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  },

  // CARD
  card: {
    position: "relative",
    padding: "20px",
    borderRadius: "20px",
    textAlign: "center",

    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",

    border: "1px solid rgba(255,255,255,0.2)",
    color: "brown",

    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    overflow: "hidden",
    cursor: "pointer"
  },

  // GLOW EFFECT
  glow: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "light blue",
    opacity: 0.2,
    filter: "blur(60px)"
  },

  // TEXT
  title: {
    position: "relative",
    zIndex: 1,
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "10px"
  },

  text: {
    position: "relative",
    zIndex: 1,
    fontSize: "14px",
    opacity: 0.8
  },

  // BUTTONS
  actions: {
    position: "relative",
    zIndex: 1,
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "10px"
  },

  editBtn: {
    background: "#00c853",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff"
  },

  deleteBtn: {
    background: "#d50000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff"
  }
};

export default HabitList;