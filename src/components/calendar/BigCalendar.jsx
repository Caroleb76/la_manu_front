import React from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import "./BigCalendar.css";

// Configure French locale
dayjs.locale("fr");
const localizer = dayjsLocalizer(dayjs);

// French translations for the calendar
const messages = {
    allDay: "Journée",
    previous: "Précédent",
    next: "Suivant",
    today: "Aujourd'hui",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
    agenda: "Agenda",
    date: "Date",
    time: "Heure",
    event: "Événement",
    noEventsInRange: "Aucun événement dans cette période.",
    showMore: (total) => `+ ${total} événement(s) supplémentaire(s)`,
};

const BigCalendar = ({ events }) => {
    // Custom event styling to prevent overlap and improve visibility
    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: "#3174ad",
                borderRadius: "5px",
                opacity: 0.9,
                color: "white",
                border: "none",
                display: "block",
                fontSize: "12px",
                padding: "2px 4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
        };
    };

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
                views={["month", "week", "day", "agenda"]}
                messages={messages}
                eventPropGetter={eventStyleGetter}
                step={30}
                timeslots={2}
                popup={true}
                selectable={false}
            
            />
        </div>
    );
};

export default BigCalendar;