import React from "react";

const categoryColors = {
  Class: {
    light: "bg-blue-100 text-blue-700",
    dark: "dark:bg-blue-900 dark:text-blue-200"
  },
  Assignment: {
    light: "bg-green-100 text-green-700",
    dark: "dark:bg-green-900 dark:text-green-200"
  },
  Meeting: {
    light: "bg-purple-100 text-purple-700",
    dark: "dark:bg-purple-900 dark:text-purple-200"
  },
  Masterclass: {
    light: "bg-yellow-100 text-yellow-800",
    dark: "dark:bg-yellow-900 dark:text-yellow-100"
  },
  Quiz: {
    light: "bg-pink-100 text-pink-700",
    dark: "dark:bg-pink-900 dark:text-pink-200"
  },
  Contest: {
    light: "bg-red-100 text-red-700",
    dark: "dark:bg-red-900 dark:text-red-200"
  },
  Practice: {
    light: "bg-teal-100 text-teal-700",
    dark: "dark:bg-teal-900 dark:text-teal-200"
  },
  Other: {
    light: "bg-gray-200 text-gray-700",
    dark: "dark:bg-gray-800 dark:text-gray-200"
  }
};

function EventCard({
  title,
  start,
  end,
  duration,
  bgColor,
  borderColor,
  textColor,
  height = 100,
  category,
}) {
  const color = categoryColors[category] || categoryColors["Class"];
  return (
    <div
      className={
        `rounded-2xl border-0 px-6 py-4 shadow-lg flex flex-col gap-2 transition-colors duration-200 ` +
        `bg-blue-50 dark:bg-blue-950` +
        " min-w-[220px] max-w-full"
      }
      style={{ height }}
    >
      {/* Category Badge */}
      {category && (
        <span className={`self-end mb-1 ${color.light} ${color.dark} text-xs font-bold px-3 py-1 rounded-full shadow`}>
          {category}
        </span>
      )}
      {/* Title and Time */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-blue-700 dark:text-blue-200 truncate">{title}</h3>
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 ml-2">{start} - {end}</span>
      </div>
      {/* Description or Duration */}
      {duration && (
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-300 mt-1">{duration}</div>
      )}
    </div>
  );
}

export default EventCard;
