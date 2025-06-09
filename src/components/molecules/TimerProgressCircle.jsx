import React from 'react';
import { motion } from 'framer-motion';

const TimerProgressCircle = ({ progress }) => {
  const circumference = 2 * Math.PI * 120; // radius of 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="w-80 h-80 transform -rotate-90"
      viewBox="0 0 280 280"
    >
      {/* Background circle */}
      <circle
        cx="140"
        cy="140"
        r="120"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="8"
        fill="none"
      />
      
      {/* Progress circle */}
      <motion.circle
        cx="140"
        cy="140"
        r="120"
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
};

export default TimerProgressCircle;