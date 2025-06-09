import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TimerProgressCircle from '@/components/molecules/TimerProgressCircle';
import TimerDisplayContent from '@/components/molecules/TimerDisplayContent';

const TIMER_STATES = {
  WORK: 'work',
  BREAK: 'break',
  LONG_BREAK: 'long_break'
};

const MainTimer = ({ 
  timeRemaining, 
  timerState, 
  timerStatus, 
  progress, 
  formatTime 
}) => {
  const getStateLabel = () => {
    switch (timerState) {
      case TIMER_STATES.WORK:
        return 'Focus Time';
      case TIMER_STATES.BREAK:
        return 'Short Break';
      case TIMER_STATES.LONG_BREAK:
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };
  
  const getStateIcon = () => {
    switch (timerState) {
      case TIMER_STATES.WORK:
        return 'Brain';
      case TIMER_STATES.BREAK:
      case TIMER_STATES.LONG_BREAK:
        return 'Coffee';
      default:
        return 'Brain';
    }
  };
  
  return (
    <div className="relative">
      {/* State label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center gap-2 text-white/80 text-lg">
          <ApperIcon name={getStateIcon()} size={20} />
          <span>{getStateLabel()}</span>
        </div>
      </motion.div>
      
      {/* Circular timer */}
      <div className="relative mb-8">
        <TimerProgressCircle progress={progress} />
        <TimerDisplayContent 
          timeRemaining={timeRemaining} 
          timerStatus={timerStatus} 
          formatTime={formatTime} 
        />
      </div>
    </div>
  );
};

export default MainTimer;