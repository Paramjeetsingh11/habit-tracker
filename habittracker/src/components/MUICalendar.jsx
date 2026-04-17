// src/components/MUICalendar.jsx
import * as React from "react";
import dayjs from "dayjs";
import { markHabit, getLogs } from "../api/habitApi";

import { Card, CardContent, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

function MUICalendar({
  logs = [],
  setLogs,
  habitId,
  startDate,
  endDate,
  refreshStreak,
  streak
}) {
  const [value, setValue] = React.useState(dayjs());
  const today = dayjs().format("YYYY-MM-DD");

  // ✅ GET STATUS (DEFAULT = pending)
  const getStatus = (date) => {
    const found = logs.find(
      (l) => dayjs(l.date).format("YYYY-MM-DD") === date
    );
    return found?.status || "pending";
  };

  // ✅ CHECK RANGE
  const isWithinRange = (date) => {
    return (
      (!startDate || date >= startDate) &&
      (!endDate || date <= endDate)
    );
  };

  const iconStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "10px",
    pointerEvents: "none",
  };

  return (
    <Card
      sx={{
        maxWidth: 300,
        height: 380,
        margin: "0 auto",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: 1.5 }}>

        {/* 🔥 STREAK */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: "#ff5722",
            textAlign: "center",
            mb: 0.5
          }}
        >
          🔥 {streak?.currentStreak || 0}-day streak
        </Typography>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          📅 Habit Calendar
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}

            sx={{
              width: "100%",
              "& .MuiPickersCalendarHeader-root": {
                fontSize: "0.8rem",
              },
              "& .MuiDayCalendar-weekDayLabel": {
                fontSize: "0.7rem",
              },
              "& .MuiPickersDay-root": {
                width: 32,
                height: 32,
                fontSize: "0.75rem",
                margin: "2px",
              },
            }}

            slots={{
              day: (props) => {
                const date = dayjs(props.day).format("YYYY-MM-DD");
                const status = getStatus(date);

                const isToday = date === today;
                const inRange = isWithinRange(date);

                return (
                  <div style={{ position: "relative" }}>
                    <PickersDay
                      {...props}

                      // 🔥 DISABLE OUTSIDE RANGE
                      disabled={!inRange}

                      sx={{
                        ...(status === "completed" && {
                          backgroundColor: "#4CAF50 !important",
                          color: "white",
                        }),

                        ...(status === "missed" && {
                          backgroundColor: "#EF5350 !important",
                          color: "white",
                        }),

                        ...(status === "pending" && {
                          backgroundColor: "#E0E0E0",
                        }),

                        ...(isToday && {
                          border: "2px solid #1976d2",
                        }),
                      }}

                      onClick={async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        if (!habitId) return;
                        if (!inRange) return;

                        // 🔥 ALLOW ONLY TODAY CLICK
                        if (!isToday) return;

                        let newStatus = "completed";

                        if (status === "completed") newStatus = "missed";
                        else if (status === "missed") newStatus = "completed";

                        // 🔥 UPDATE UI FIRST
                        const updatedLogs = logs.map((l) =>
                          dayjs(l.date).format("YYYY-MM-DD") === date
                            ? { ...l, status: newStatus }
                            : l
                        );

                        setLogs(updatedLogs);

                        try {
                          await markHabit({
                            habit_id: habitId,
                            date,
                            status: newStatus,
                          });

                          // 🔥 REFRESH FROM SERVER
                          const res = await getLogs(habitId);
                          setLogs(res.data);

                          if (refreshStreak) {
                            await refreshStreak(habitId);
                          }

                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />

                    {/* ICONS */}
                    {status === "completed" && (
                      <span style={iconStyle}>✔</span>
                    )}
                    {status === "missed" && (
                      <span style={iconStyle}>✖</span>
                    )}
                  </div>
                );
              },
            }}
          />
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
}

export default MUICalendar;