import sessionService from './sessionService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StatsService {
  constructor() {
    this.storageKey = 'focusflow_stats';
    this.defaultStats = {
      dailyGoal: 8,
      completedToday: 0,
      currentStreak: 0,
      totalSessions: 0,
      lastCompletedDate: null
    };
  }
  
  async getStats() {
    await delay(200);
    
    const stored = localStorage.getItem(this.storageKey);
    let stats = stored ? JSON.parse(stored) : { ...this.defaultStats };
    
    // Update today's completed sessions
    const todaySessions = await sessionService.getTodaySessions();
    const workSessions = todaySessions.filter(session => session.type === 'work');
    stats.completedToday = workSessions.length;
    
    // Update total sessions
    const allSessions = await sessionService.getAll();
    const completedWorkSessions = allSessions.filter(
      session => session.completed && session.type === 'work'
    );
    stats.totalSessions = completedWorkSessions.length;
    
    // Update streak
    stats.currentStreak = await this.calculateStreak();
    
    // Save updated stats
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
    
    return { ...stats };
  }
  
  async incrementCompleted() {
    await delay(300);
    
    const stats = await this.getStats();
    const today = new Date().toDateString();
    
    stats.completedToday += 1;
    stats.totalSessions += 1;
    stats.lastCompletedDate = today;
    
    // Recalculate streak
    stats.currentStreak = await this.calculateStreak();
    
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
    
    return { ...stats };
  }
  
  async calculateStreak() {
    await delay(100);
    
    const sessions = await sessionService.getAll();
    const workSessions = sessions
      .filter(session => session.completed && session.type === 'work')
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    if (workSessions.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if we have any sessions today
    const today = currentDate.toDateString();
    const hasSessionToday = workSessions.some(session => 
      new Date(session.startTime).toDateString() === today
    );
    
    // If no session today, check yesterday
    if (!hasSessionToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count consecutive days with sessions
    while (true) {
      const dateStr = currentDate.toDateString();
      const hasSessionOnDate = workSessions.some(session => 
        new Date(session.startTime).toDateString() === dateStr
      );
      
      if (hasSessionOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  async updateDailyGoal(goal) {
    await delay(200);
    
    const stats = await this.getStats();
    stats.dailyGoal = goal;
    
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
    
    return { ...stats };
  }
  
  async reset() {
    await delay(200);
    
    localStorage.removeItem(this.storageKey);
    return { ...this.defaultStats };
  }
}

export default new StatsService();