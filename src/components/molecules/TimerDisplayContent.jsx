import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TIMER_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

const TimerDisplayContent = ({ timeRemaining, timerStatus, formatTime }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          key={timeRemaining}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-6xl md:text-7xl font-mono font-bold text-white mb-2"
        >
          {formatTime(timeRemaining)}
        </motion.div>
        
        <div className="flex items-center justify-center gap-2 text-white/70">
          {timerStatus === TIMER_STATUS.RUNNING && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-2 h-2 bg-white rounded-full"
            />
          )}
          {timerStatus === TIMER_STATUS.PAUSED && (
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white/70 rounded-full" />
              <div className="w-1 h-3 bg-white/70 rounded-full" />
            </div>
          )}
          {timerStatus === TIMER_STATUS.COMPLETED && (
            <ApperIcon name="CheckCircle" size={16} className="text-white" />
          )}
          <span className="text-sm font-medium capitalize">
            {timerStatus === TIMER_STATUS.IDLE ? 'Ready' : timerStatus}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplayContent;