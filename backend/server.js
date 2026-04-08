const express = require("express");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const userRoutes = require("./routes/userRoutes");
const habitRoutes = require("./routes/habitRoutes");

// USE ROUTES
app.use("/", userRoutes);
app.use("/", habitRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});