import React from "react";
import googleIcon from "../../assets/google.svg";

function formatDateTimeForGoogle(date, time) {
  // date: "YYYY-MM-DD", time: "HH:mm"
  if (!date || !time) return "";
  const dt = new Date(`${date}T${time}`);
  // Format: YYYYMMDDTHHmmssZ (UTC)
  return dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function AddToGoogleCalendarButton({ event, small, iconLeft }) {
  if (!event) return null;

  // Accepts event with: title, description, date, startTime, endTime
  // Fallbacks for missing fields
  const title = event.title || "Event";
  const description = event.description || "";
  // Try to extract date, startTime, endTime from event
  let date = event.date;
  let startTime = event.startTime;
  let endTime = event.endTime;

  // If event.start and event.end are ISO strings, parse them
  if (!date && event.start) {
    const startDate = new Date(event.start);
    date = startDate.toISOString().slice(0, 10);
    startTime = startDate.toTimeString().slice(0, 5);
  }
  if (!endTime && event.end) {
    const endDate = new Date(event.end);
    endTime = endDate.toTimeString().slice(0, 5);
  }

  const start = formatDateTimeForGoogle(date, startTime);
  const end = formatDateTimeForGoogle(date, endTime || startTime);

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&details=${encodeURIComponent(description)}&dates=${start}/${end}`;

  if (small) {
    const icon = (
      <img src={googleIcon} alt="Google Calendar" className="w-5 h-5" />
    );
    if (iconLeft) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full p-2 shadow transition text-base mr-2"
          title="Add to Google Calendar"
          tabIndex={0}
          onClick={e => e.stopPropagation && e.stopPropagation()}
        >
          {icon}
        </a>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full p-2 shadow transition text-base"
        title="Add to Google Calendar"
        tabIndex={0}
        onClick={e => e.stopPropagation && e.stopPropagation()}
      >
        {icon}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition mt-2 text-sm"
      title="Add to Google Calendar"
    >
      Add to Google Calendar
    </a>
  );
} 