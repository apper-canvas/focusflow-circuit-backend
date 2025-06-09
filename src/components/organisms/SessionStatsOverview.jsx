import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';

const SessionStatsOverview = ({ stats }) => {
  if (!stats) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white glass"
    >
      <div className="flex items-center gap-4">
        <StatCard 
          iconName="Target" 
          label="Today" 
          value={stats.completedToday} 
          subLabel={`of ${stats.dailyGoal}`} 
        />
        
        <StatCard 
          iconName="Flame" 
          label="Streak" 
          value={stats.currentStreak} 
          subLabel="days" 
        />
        
        <StatCard 
          iconName="BarChart3" 
          label="Total" 
          value={stats.totalSessions} 
          subLabel="sessions" 
        />
      </div>
    </motion.div>
  );
};

export default SessionStatsOverview;