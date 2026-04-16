// src/components/PieChartView.jsx

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography } from "@mui/material";

function PieChartView({ logs = [] }) {

  // ✅ COUNT EACH STATUS
  const completed = logs.filter(l => l.status === "completed").length;
  const missed = logs.filter(l => l.status === "missed").length;
  const visited = logs.filter(l => l.status === "visited").length;

  const total = logs.length;

  // ✅ HANDLE EMPTY DATA
  if (total === 0) {
    return (
      <Typography textAlign="center" color="text.secondary">
        No data available
      </Typography>
    );
  }

  // ✅ CONVERT TO PERCENTAGE
  const data = [
    {
      name: "Completed",
      value: Math.round((completed / total) * 100),
    },
    {
      name: "Missed",
      value: Math.round((missed / total) * 100),
    },
    {
      name: "Visited",
      value: Math.round((visited / total) * 100),
    },
  ];

  const COLORS = ["#4CAF50", "#EF5350", "#FFA726"];

  return (
    <Box textAlign="center">

      <Typography variant="h6" mb={2}>
        Habit Progress Overview
      </Typography>

      <PieChart width={300} height={280}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label={({ name, value }) => `${name}: ${value}%`}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>

    </Box>
  );
}

export default PieChartView;