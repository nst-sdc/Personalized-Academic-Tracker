import React from "react";
{/* Leaving comments so that it helps later */}

function EventCard({
  title,
  start,
  end,
  duration,
  bgColor,
  borderColor,
  textColor,
  avatars,
  height = 152,
}) {
  return (
    <div
      className={`rounded-[18px] border-[2px] border-dashed ${borderColor} ${bgColor} w-[236px] px-5 pt-4 pb-3 relative`}
      style={{
        height: `${height}px`,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Title */}
      <p className={`text-[14px] font-semibold leading-snug mb-1 text-[#212121]`}>
        {title}
      </p>

      {/* Time */}
      <p className="text-[12px] text-[#757575] leading-none mb-4">
        {start} – {end}
      </p>

      {/* Avatars */}
      <div className="flex -space-x-2 mb-4">
        {Array.from({ length: avatars }).map((_, index) => (
          <div
            key={index}
            className="h-7 w-7 rounded-full border-2 border-white  bg-gray-300 overflow-hidden flex-shrink-0"
          >
            <img
              src={`https://via.placeholder.com/28?text=A${index + 1}`}
              alt={`Avatar ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Duration */}
      <p className={`text-[12px] font-semibold absolute bottom-3 right-4 ${textColor}`}>
        {duration}
      </p>
    </div>
  );
}

export default EventCard;
