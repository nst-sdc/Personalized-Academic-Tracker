import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css"; // We'll create this file for custom styles

const Calendar = ({ darkMode }) => {
  const events = [
    {
      title: "Assignment 1 Due",
      start: "2024-07-29T10:00:00",
      end: "2024-07-29T11:00:00",
      allDay: false,
      backgroundColor: "#ef4444",
      borderColor: "#ef4444",
    },
    {
      title: "Quiz",
      start: "2024-07-30",
      allDay: true,
      backgroundColor: "#f97316",
      borderColor: "#f97316",
    },
    {
      title: "Project Submission",
      start: "2024-08-05",
      allDay: true,
      backgroundColor: "#10b981",
      borderColor: "#10b981",
    },
    {
      title: "Mid-term Exam",
      start: "2024-08-15",
      end: "2024-08-17",
      allDay: true,
      backgroundColor: "#3b82f6",
      borderColor: "#3b82f6",
    },
  ];

  return (
    <div className={`p-4 sm:p-8 calendar-container ${darkMode ? "dark" : ""}`}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventContent={renderEventContent}
      />
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

export default Calendar;
