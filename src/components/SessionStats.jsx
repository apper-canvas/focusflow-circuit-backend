import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const SessionStats = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white glass"
    >
      <div className="flex items-center gap-4">
        {/* Today's sessions */}
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <ApperIcon name="Target" size={16} />
            <span className="text-xs opacity-80">Today</span>
          </div>
          <div className="text-xl font-bold">
            {stats.completedToday}
          </div>
          <div className="text-xs opacity-60">
            of {stats.dailyGoal}
          </div>
        </div>
        
        {/* Current streak */}
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <ApperIcon name="Flame" size={16} />
            <span className="text-xs opacity-80">Streak</span>
          </div>
          <div className="text-xl font-bold">
            {stats.currentStreak}
          </div>
          <div className="text-xs opacity-60">
            days
          </div>
        </div>
        
        {/* Total sessions */}
        <div className="text-center">
          <div className="flex items-center gap-1 mb-1">
            <ApperIcon name="BarChart3" size={16} />
            <span className="text-xs opacity-80">Total</span>
          </div>
          <div className="text-xl font-bold">
            {stats.totalSessions}
          </div>
          <div className="text-xs opacity-60">
            sessions
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionStats;