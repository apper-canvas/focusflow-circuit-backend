import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const TIMER_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

const TimerControls = ({ 
  timerStatus, 
  onPlayPause, 
  onReset, 
  onSettingsClick 
}) => {
  const getPlayPauseIcon = () => {
    return timerStatus === TIMER_STATUS.RUNNING ? 'Pause' : 'Play';
  };
  
  const getPlayPauseLabel = () => {
    if (timerStatus === TIMER_STATUS.IDLE) return 'Start';
    return timerStatus === TIMER_STATUS.RUNNING ? 'Pause' : 'Resume';
  };
  
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Reset button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
        title="Reset (R)"
      >
        <ApperIcon name="RotateCcw" size={20} />
      </motion.button>
      
      {/* Play/Pause button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayPause}
        className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        title="Start/Pause (Space)"
      >
        <ApperIcon name={getPlayPauseIcon()} size={20} />
        <span>{getPlayPauseLabel()}</span>
      </motion.button>
      
      {/* Settings button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSettingsClick}
        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
        title="Settings"
      >
        <ApperIcon name="Settings" size={20} />
      </motion.button>
    </div>
  );
};

export default TimerControls;