import React, { Component } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = dayjsLocalizer(dayjs);

const BigCalendar = ({ events }) => {
  return (
    <div className="bigCalendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 350 }}
        defaultDate={new Date()}
        defaultView="week"
      />
    </div>
  );
};

export default BigCalendar;
