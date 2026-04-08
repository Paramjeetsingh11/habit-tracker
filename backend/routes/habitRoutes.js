const express = require("express");
const router = express.Router();

const habitController = require("../controllers/habitController");

// CREATE
router.post("/add-habit", habitController.createHabit);

// READ
router.get("/habits/:userId", habitController.getHabits);

// UPDATE
router.put("/update-habit/:id", habitController.updateHabit);

// DELETE
router.delete("/delete-habit/:id", habitController.deleteHabit);

router.get("/logs/:habitId", habitController.getLogs);

router.post("/mark", habitController.markHabit);

module.exports = router;