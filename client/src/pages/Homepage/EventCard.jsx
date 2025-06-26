import React from "react";
import { motion } from "framer-motion"; // Add this import

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
  index = 0, // Optional index for stagger effect
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        borderColor: "#2563eb", // blue-600
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className={`rounded-[18px] border-[2px] border-dashed ${borderColor} ${bgColor} w-[236px] px-5 pt-4 pb-3 relative transition-shadow duration-200 hover:shadow-xl`}
      style={{
        height: `${height}px`,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
      }}
      >
      {/* Title */}
      <p className="text-[14px] font-semibold leading-snug mb-1 text-[#212121]">
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
            className="h-7 w-7 rounded-full border-2 border-white bg-gray-300 overflow-hidden flex-shrink-0"
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
    </motion.div>
  );
}

export default EventCard;
