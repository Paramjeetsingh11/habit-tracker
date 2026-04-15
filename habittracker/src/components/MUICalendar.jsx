// src/components/MUICalendar.jsx

import * as React from "react";
import dayjs from "dayjs";
import { markHabit } from "../api/habitApi";

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
}) {
  const [value, setValue] = React.useState(dayjs());

  const today = dayjs().format("YYYY-MM-DD");

  // ✅ Get status
  const getStatus = (date) => {
    const found = logs.find(
      (l) => dayjs(l.date).format("YYYY-MM-DD") === date
    );
    return found?.status;
  };

  return (
    <Card
      sx={{
        maxWidth: 350,
        height: 380,
        margin: "0 auto",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📅 Habit Calendar
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}

            slots={{
              day: (props) => {
                const date = dayjs(props.day).format("YYYY-MM-DD");
                const status = getStatus(date);

                const isPast = date < today;
                const isFuture = date > today;

                return (
                  <div style={{ position: "relative" }}>
                    <PickersDay
                      {...props}

                      // ❌ Disable past + future
                      disabled={isPast || isFuture}

                      onClick={async (e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        if (!habitId) return;

                        // ❌ Only today allowed
                        if (date !== today) return;

                        // 🚫 respect habit range
                        if (
                          (startDate && date < startDate) ||
                          (endDate && date > endDate)
                        ) return;

                        let newStatus = "completed";

                        if (status === "completed") newStatus = "missed";
                        else if (status === "missed") newStatus = "completed";

                        // ✅ Update only today
                        const exists = logs.find(
                          (l) =>
                            dayjs(l.date).format("YYYY-MM-DD") === date
                        );

                        let updatedLogs;

                        if (exists) {
                          updatedLogs = logs.map((l) =>
                            dayjs(l.date).format("YYYY-MM-DD") === date
                              ? { ...l, status: newStatus }
                              : l
                          );
                        } else {
                          updatedLogs = [...logs, { date, status: newStatus }];
                        }

                        setLogs(updatedLogs);

                        // ✅ Save to DB
                        try {
                          await markHabit({
                            habit_id: habitId,
                            date,
                            status: newStatus,
                          });
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    />

                    {/* 🔵 TODAY HIGHLIGHT (optional override) */}
                    {date === today && (
                      <span
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 6,
                          fontSize: "8px",
                          color: "#1976d2",
                        }}
                      >
                        ●
                      </span>
                    )}

                    {/* DOT INDICATOR */}
                    {status && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "10px",
                          color:
                            status === "completed"
                              ? "green"
                              : "red",
                        }}
                      >
                        ●
                      </span>
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