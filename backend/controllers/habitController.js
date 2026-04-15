// controllers/habitController.js
const db = require("../db");

// CREATE HABIT
exports.createHabit = (req, res) => {
  const { user_id, title, type, goal_days, start_date, end_date } = req.body;

  // 🔴 VALIDATION
  if (!user_id || !title || !type || !goal_days) {
    return res.status(400).send("All fields are required ❌");
  }

  // Optional: validate type
  if (!["daily", "weekly"].includes(type)) {
    return res.status(400).send("Invalid habit type ❌");
  }

  const sql =
  "INSERT INTO habits (user_id, title, type, goal_days, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [user_id, title, type, goal_days, start_date, end_date], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error creating habit");
    }

    res.send("Habit created ✅");
  });
};

// GET ALL HABITS
exports.getHabits = (req, res) => {
  const sql = "SELECT * FROM habits WHERE user_id = ?";

  db.query(sql, [req.params.userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching habits");
    }

    res.json(result);
  });
};

// UPDATE HABIT
exports.updateHabit = (req, res) => {
  const { title, type, goal_days, start_date, end_date } = req.body;

  const sql =
  "UPDATE habits SET title = ?, type = ?, goal_days = ?, start_date = ?, end_date = ? WHERE id = ?";

  db.query(
  sql,
  [title, type, goal_days, start_date, end_date, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating habit");
      }

      res.send("Habit updated ✏️");
    }
  );
};

// DELETE HABIT
exports.deleteHabit = (req, res) => {
  const sql = "DELETE FROM habits WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error deleting habit");
    }

    res.send("Habit deleted 🗑️");
  });
};
// GET LOGS FOR CALENDAR
exports.getLogs = (req, res) => {
  const sql = "SELECT date, status FROM habit_logs WHERE habit_id = ?";

  db.query(sql, [req.params.habitId], (err, result) => {
    if (err) return res.send(err);

    const formatted = result.map(r => ({
      date: r.date,
      status: r.status
    }));

    res.json(formatted);
  });
};

// MARK HABIT DONE
exports.markHabit = (req, res) => {
  const { habit_id, date, status } = req.body;

  if (!habit_id || !date) {
    return res.status(400).send("Missing data ❌");
  }

  // Check if entry exists
  const checkSql =
    "SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?";

  db.query(checkSql, [habit_id, date], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length > 0) {
      // Update existing
      const updateSql =
        "UPDATE habit_logs SET status = ? WHERE habit_id = ? AND date = ?";

      db.query(updateSql, [status, habit_id, date], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Updated existing log 🔄");
      });

    } else {
      // Insert new
      const insertSql =
        "INSERT INTO habit_logs (habit_id, date, status) VALUES (?, ?, ?)";

      db.query(insertSql, [habit_id, date, status], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Habit marked ✅");
      });
    }
  });
};

// GET STREAK DATA
exports.getStreak = (req, res) => {
  const { habitId } = req.params;

  const sql = `
    SELECT date, status 
    FROM habit_logs 
    WHERE habit_id = ?
    ORDER BY date ASC
  `;

  db.query(sql, [habitId], (err, rows) => {
    if (err) return res.status(500).send(err);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];

    rows.forEach((log) => {
      if (log.status === "completed") {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // 🔥 CURRENT STREAK (reverse check from today)
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i].status === "completed") {
        currentStreak++;
      } else {
        break;
      }
    }

    res.json({
      currentStreak,
      longestStreak,
    });
  });
};
