import sessionService from './sessionService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class StatsService {
  constructor() {
    this.tableName = 'stats';
    this.defaultStats = {
      daily_goal: 8,
      completed_today: 0,
      current_streak: 0,
      total_sessions: 0,
      last_completed_date: null
    };
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(200);
    
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: ['Name', 'daily_goal', 'completed_today', 'current_streak', 'total_sessions', 'last_completed_date'],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  }

  async getStats() {
    await delay(200);
    
    try {
      const stats = await this.getAll();
      
      if (stats.length > 0) {
        const dbStats = stats[0];
        
        // Update today's completed sessions from session data
        const todaySessions = await sessionService.getTodaySessions();
        const workSessions = todaySessions.filter(session => session.type === 'work');
        
        // Update total sessions from session data
        const allSessions = await sessionService.getAll();
        const completedWorkSessions = allSessions.filter(
          session => session.completed && session.type === 'work'
        );
        
        const updatedStats = {
          dailyGoal: dbStats.daily_goal || this.defaultStats.daily_goal,
          completedToday: workSessions.length,
          currentStreak: await this.calculateStreak(),
          totalSessions: completedWorkSessions.length,
          lastCompletedDate: dbStats.last_completed_date || this.defaultStats.last_completed_date
        };
        
        // Update the database with calculated values
        await this.updateStats(updatedStats);
        
        return updatedStats;
      }
      
      // Create default stats if none exist
      return await this.createDefaultStats();
    } catch (error) {
      console.error('Error getting stats:', error);
      return this.transformFromDb(this.defaultStats);
    }
  }

  async createDefaultStats() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Name: 'User Stats',
          daily_goal: this.defaultStats.daily_goal,
          completed_today: this.defaultStats.completed_today,
          current_streak: this.defaultStats.current_streak,
          total_sessions: this.defaultStats.total_sessions,
          last_completed_date: this.defaultStats.last_completed_date
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return this.transformFromDb(this.defaultStats);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return this.transformFromDb(result.data);
        }
      }
      
      return this.transformFromDb(this.defaultStats);
    } catch (error) {
      console.error('Error creating default stats:', error);
      return this.transformFromDb(this.defaultStats);
    }
  }

  async updateStats(stats) {
    try {
      const existingStats = await this.getAll();
      
      const dbData = {
        daily_goal: stats.dailyGoal,
        completed_today: stats.completedToday,
        current_streak: stats.currentStreak,
        total_sessions: stats.totalSessions,
        last_completed_date: stats.lastCompletedDate
      };

      if (existingStats.length > 0) {
        // Update existing stats
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Id: existingStats[0].Id,
            ...dbData
          }]
        };
        
        const response = await apperClient.updateRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          return stats;
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return this.transformFromDb(result.data);
          }
        }
      } else {
        // Create new stats
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Name: 'User Stats',
            ...dbData
          }]
        };
        
        const response = await apperClient.createRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          return stats;
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return this.transformFromDb(result.data);
          }
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Error updating stats:', error);
      return stats;
    }
  }

  async incrementCompleted() {
    await delay(300);
    
    try {
      const stats = await this.getStats();
      const today = new Date().toISOString().slice(0, 10);
      
      const updatedStats = {
        dailyGoal: stats.dailyGoal,
        completedToday: stats.completedToday + 1,
        currentStreak: await this.calculateStreak(),
        totalSessions: stats.totalSessions + 1,
        lastCompletedDate: today
      };
      
      return await this.updateStats(updatedStats);
    } catch (error) {
      console.error('Error incrementing completed:', error);
      throw error;
    }
  }

  async calculateStreak() {
    await delay(100);
    
    try {
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
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  async updateDailyGoal(goal) {
    await delay(200);
    
    try {
      const stats = await this.getStats();
      const updatedStats = {
        ...stats,
        dailyGoal: goal
      };
      
      return await this.updateStats(updatedStats);
    } catch (error) {
      console.error('Error updating daily goal:', error);
      throw error;
    }
  }

  transformFromDb(dbStats) {
    return {
      dailyGoal: dbStats.daily_goal || this.defaultStats.daily_goal,
      completedToday: dbStats.completed_today || this.defaultStats.completed_today,
      currentStreak: dbStats.current_streak || this.defaultStats.current_streak,
      totalSessions: dbStats.total_sessions || this.defaultStats.total_sessions,
      lastCompletedDate: dbStats.last_completed_date || this.defaultStats.last_completed_date
    };
  }

  async reset() {
    await delay(200);
    
    try {
      const existingStats = await this.getAll();
      
      if (existingStats.length > 0) {
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Id: existingStats[0].Id,
            daily_goal: this.defaultStats.daily_goal,
            completed_today: this.defaultStats.completed_today,
            current_streak: this.defaultStats.current_streak,
            total_sessions: this.defaultStats.total_sessions,
            last_completed_date: this.defaultStats.last_completed_date
          }]
        };
        
        const response = await apperClient.updateRecord(this.tableName, params);
        
        if (response.success && response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return this.transformFromDb(result.data);
          }
        }
      }
      
      return this.transformFromDb(this.defaultStats);
    } catch (error) {
      console.error('Error resetting stats:', error);
      return this.transformFromDb(this.defaultStats);
    }
  }
}

export default new StatsService();