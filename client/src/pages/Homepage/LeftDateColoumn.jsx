import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LeftDateColumn = ({ darkMode }) => {
  const bgMain = darkMode ? "bg-[#0D0D0D]" : "bg-white";
  const textPrimary = darkMode ? "text-white" : "text-[#333333]";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-500";
  const textLight = darkMode ? "text-gray-300" : "text-gray-400";
  const cardBg = darkMode ? "bg-[#1E1E1E]" : "bg-white";
  const highlightCardBg = darkMode ? "bg-[#2A2A2A]" : "bg-cyan-50";

  return (
    <div
      className={`w-80 ${bgMain} p-6 flex-shrink-0 h-[calc(100vh-70px)] overflow-hidden transition-colors duration-300 font-khula`}
    >
      <div className="flex items-center justify-between mb-8">
        <button aria-label="Previous month" className={`p-1 ${textLight}`}>
          <IoIosArrowBack size={20} />
        </button>
        <h2 className={`text-lg font-medium ${textPrimary}`}>October 2022</h2>
        <button aria-label="Next month" className={`p-1 ${textLight}`}>
          <IoIosArrowForward size={20} />
        </button>
      </div>

      <div className="mb-10">
        <div className="text-left">
          <span className={`text-3xl font-light ${textLight}`}>This </span>
          <span className={`text-5xl font-bold ${textPrimary}`}>Week</span>
        </div>
      </div>

      <div className={`${highlightCardBg} rounded-lg p-4 mb-10`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-[#59C3C8] text-white text-xs px-2 py-1 rounded">Today</span>
          <span className={`text-sm font-medium ${textPrimary}`}>Fundamentals of Design</span>
        </div>

        <div className="flex items-start gap-3 mb-3">
          <div className={`text-[60px] font-semibold leading-tight ${textPrimary}`}>M</div>
          <div className="flex-1 pt-1">
            <div className={`font-medium text-base mb-1 ${textPrimary}`}>Ergonomics</div>
            <div className={`text-xs ${textSecondary}`}>11:00 → 12:00</div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className={`text-2xl font-light ${textLight}`}>10th</div>
          <div className="text-right">
            <div className={`text-sm font-medium mb-1 ${textPrimary}`}>
              Tales of Women in Design
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-red-500 rounded"></div>
              <span className="text-xs font-medium text-red-500">Begins in 30m</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-lg p-4 mb-10`}>
        <div className="flex items-start gap-3 mb-3">
          <div className={`text-[60px] font-semibold leading-tight ${textPrimary}`}>T</div>
          <div className="flex-1 pt-1">
            <div className={`font-medium text-base mb-1 ${textPrimary}`}>
              Research Methodologies
            </div>
            <div className={`text-xs ${textSecondary}`}>13:00 → 14:00</div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div className={`text-2xl font-light ${textLight}`}>11th</div>
          <div className="text-right">
            <div className={`text-sm font-medium mb-1 ${textPrimary}`}>
              Approaches to Culture
            </div>
            <div className={`text-xs ${textSecondary}`}>16:00 → 17:00</div>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-lg p-4`}>
        <div className="flex items-start gap-3 mb-3">
          <div className={`text-[60px] font-semibold leading-tight ${textPrimary}`}>W</div>
          <div className="flex-1 pt-1">
            <div className={`font-medium text-base mb-1 ${textPrimary}`}>
              Introduction to Narratology
            </div>
            <div className={`text-xs ${textSecondary}`}>11:00 → 12:00</div>
          </div>
        </div>

        <div className={`text-2xl font-light ${textLight}`}>12th</div>
      </div>
    </div>
  );
};

export default LeftDateColumn;