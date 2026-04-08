// src/components/MUICalendar.jsx

import * as React from "react";
import dayjs from "dayjs";

import { Card, CardContent, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

function MUICalendar() {
  const [value, setValue] = React.useState(dayjs());

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "40px auto",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📅 Habit Calendar
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
}

export default MUICalendar;