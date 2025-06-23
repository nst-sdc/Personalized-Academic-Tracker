import React from "react";

const Calendar = ({ darkMode }) => {
  const calendarURL =
    "https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Asia%2FKolkata";

  return (
    <div className={`flex-1 px-4 py-8 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <h1 className="text-2xl font-bold mb-6 text-center">📅 Academic Calendar</h1>

      <div className="w-full flex justify-center">
        <iframe
          src={calendarURL}
          style={{ border: 0 }}
          width="1000"
          height="600"
          frameBorder="0"
          scrolling="no"
          title="Google Calendar"
          className="rounded-xl shadow-lg"
        ></iframe>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Having trouble loading the calendar? Make sure it is public or shared with your ADYPU account.
      </p>
    </div>
  );
};

export default Calendar;
