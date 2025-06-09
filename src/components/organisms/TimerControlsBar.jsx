import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TIMER_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

const TimerControlsBar = ({ 
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
      <Button
        onClick={onReset}
        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
        title="Reset (R)"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="RotateCcw" size={20} />
      </Button>
      
      {/* Play/Pause button */}
      <Button
        onClick={onPlayPause}
        className="flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
        title="Start/Pause (Space)"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name={getPlayPauseIcon()} size={20} />
        <span>{getPlayPauseLabel()}</span>
      </Button>
      
      {/* Settings button */}
      <Button
        onClick={onSettingsClick}
        className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-colors"
        title="Settings"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ApperIcon name="Settings" size={20} />
      </Button>
    </div>
  );
};

export default TimerControlsBar;