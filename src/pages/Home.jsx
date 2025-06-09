import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import TimerControls from '../components/TimerControls';
import SessionStats from '../components/SessionStats';
import SoundControls from '../components/SoundControls';
import SettingsModal from '../components/SettingsModal';
import NotificationBanner from '../components/NotificationBanner';
import ApperIcon from '../components/ApperIcon';
import { settingsService, sessionService, statsService } from '../services';

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

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  
  // Timer state
  const [timerState, setTimerState] = useState(TIMER_STATES.WORK);
  const [timerStatus, setTimerStatus] = useState(TIMER_STATUS.IDLE);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Refs
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, statsData] = await Promise.all([
          settingsService.getSettings(),
          statsService.getStats()
        ]);
        
        setSettings(settingsData);
        setStats(statsData);
        setTimeRemaining(settingsData.workDuration * 60);
      } catch (error) {
        toast.error('Failed to load data');
      }
    };
    
    loadData();
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [timerStatus]);
  
  // Timer logic
  useEffect(() => {
    if (timerStatus === TIMER_STATUS.RUNNING) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [timerStatus]);
  
  const handlePlayPause = () => {
    if (timerStatus === TIMER_STATUS.IDLE || timerStatus === TIMER_STATUS.PAUSED) {
      setTimerStatus(TIMER_STATUS.RUNNING);
      
      if (timerStatus === TIMER_STATUS.IDLE) {
        // Start new session
        const newSession = {
          id: Date.now().toString(),
          startTime: new Date(),
          endTime: null,
          duration: getCurrentDuration(),
          type: timerState,
          completed: false,
          taskLabel: null
        };
        setCurrentSession(newSession);
      }
    } else if (timerStatus === TIMER_STATUS.RUNNING) {
      setTimerStatus(TIMER_STATUS.PAUSED);
    }
  };
  
  const handleReset = () => {
    if (timerStatus === TIMER_STATUS.RUNNING) {
      // Show confirmation for active session
      if (window.confirm('Are you sure you want to reset the current session?')) {
        resetTimer();
      }
    } else {
      resetTimer();
    }
  };
  
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerStatus(TIMER_STATUS.IDLE);
    setTimeRemaining(getCurrentDuration() * 60);
    setCurrentSession(null);
  };
  
  const handleTimerComplete = async () => {
    clearInterval(intervalRef.current);
    setTimerStatus(TIMER_STATUS.COMPLETED);
    
    // Complete current session
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true
      };
      
      try {
        await sessionService.create(completedSession);
        
        // Update stats
        if (timerState === TIMER_STATES.WORK) {
          const updatedStats = await statsService.incrementCompleted();
          setStats(updatedStats);
          setSessionCount(prev => prev + 1);
        }
      } catch (error) {
        toast.error('Failed to save session');
      }
    }
    
    // Play notification sound
    if (settings?.soundEnabled && audioRef.current) {
      audioRef.current.volume = settings.soundVolume / 100;
      audioRef.current.play().catch(() => {
        // Audio play failed, that's ok
      });
    }
    
    // Show notification
    const message = timerState === TIMER_STATES.WORK 
      ? 'Work session complete! Time for a break.' 
      : 'Break complete! Ready for another work session?';
    
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Auto-start next session if enabled
    const shouldAutoStart = timerState === TIMER_STATES.WORK 
      ? settings?.autoStartBreaks 
      : settings?.autoStartPomodoros;
    
    if (shouldAutoStart) {
      setTimeout(() => {
        startNextSession();
      }, 5000);
    }
  };
  
  const startNextSession = () => {
    // Determine next timer state
    let nextState;
    if (timerState === TIMER_STATES.WORK) {
      // Every 4th break is a long break
      nextState = (sessionCount + 1) % 4 === 0 
        ? TIMER_STATES.LONG_BREAK 
        : TIMER_STATES.BREAK;
    } else {
      nextState = TIMER_STATES.WORK;
    }
    
    setTimerState(nextState);
    setTimeRemaining(getDurationForState(nextState) * 60);
    setTimerStatus(TIMER_STATUS.IDLE);
    setShowNotification(false);
    setCurrentSession(null);
  };
  
  const getCurrentDuration = () => {
    return getDurationForState(timerState);
  };
  
  const getDurationForState = (state) => {
    if (!settings) return 25;
    
    switch (state) {
      case TIMER_STATES.WORK:
        return settings.workDuration;
      case TIMER_STATES.BREAK:
        return settings.shortBreakDuration;
      case TIMER_STATES.LONG_BREAK:
        return settings.longBreakDuration;
      default:
        return settings.workDuration;
    }
  };
  
  const getProgressPercentage = () => {
    const totalTime = getCurrentDuration() * 60;
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSettingsUpdate = async (newSettings) => {
    try {
      const updatedSettings = await settingsService.update(newSettings);
      setSettings(updatedSettings);
      
      // Update timer if idle
      if (timerStatus === TIMER_STATUS.IDLE) {
        setTimeRemaining(getDurationForState(timerState) * 60);
      }
      
      toast.success('Settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };
  
  // Get background gradient class based on timer state
  const getBackgroundClass = () => {
    return timerState === TIMER_STATES.WORK ? 'gradient-work' : 'gradient-break';
  };
  
  if (!settings || !stats) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className={`min-h-screen transition-all duration-300 ease-in-out ${getBackgroundClass()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8 h-full flex flex-col max-w-full overflow-hidden">
        {/* Stats in top right */}
        <div className="flex justify-end mb-4">
          <SessionStats stats={stats} />
        </div>
        
        {/* Main timer area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md w-full">
            <MainFeature
              timeRemaining={timeRemaining}
              timerState={timerState}
              timerStatus={timerStatus}
              progress={getProgressPercentage()}
              formatTime={formatTime}
            />
            
            <TimerControls
              timerStatus={timerStatus}
              onPlayPause={handlePlayPause}
              onReset={handleReset}
              onSettingsClick={() => setShowSettings(true)}
            />
          </div>
        </div>
        
        {/* Sound controls in bottom left */}
        <div className="flex justify-start">
          <SoundControls
            settings={settings}
            onSettingsUpdate={handleSettingsUpdate}
            audioRef={audioRef}
          />
        </div>
        
        {/* Notification banner */}
        <AnimatePresence>
          {showNotification && (
            <NotificationBanner
              message={notificationMessage}
              onClose={() => setShowNotification(false)}
              onStartNext={startNextSession}
            />
          )}
        </AnimatePresence>
        
        {/* Settings modal */}
        <AnimatePresence>
          {showSettings && (
            <SettingsModal
              settings={settings}
              onClose={() => setShowSettings(false)}
              onUpdate={handleSettingsUpdate}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Home;