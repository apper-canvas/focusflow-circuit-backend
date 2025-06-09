import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const TIMER_STATES = {
  WORK: 'work',
  BREAK: 'break',
  LONG_BREAK: 'long_break'
};

const TIMER_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

const MainFeature = ({ 
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
  
  const circumference = 2 * Math.PI * 120; // radius of 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
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
        
        {/* Timer display */}
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
            
            {/* Status indicator */}
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
      </div>
    </div>
  );
};

export default MainFeature;