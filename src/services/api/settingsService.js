const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.tableName = 'settings';
    this.defaultSettings = {
      work_duration: 25,
      short_break_duration: 5,
      long_break_duration: 15,
      auto_start_breaks: false,
      auto_start_pomodoros: false,
      sound_enabled: true,
      sound_type: 'none',
      sound_volume: 50
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
        fields: ['Name', 'work_duration', 'short_break_duration', 'long_break_duration', 
                'auto_start_breaks', 'auto_start_pomodoros', 'sound_enabled', 'sound_type', 'sound_volume'],
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
      console.error('Error fetching settings:', error);
      return [];
    }
  }

  async getSettings() {
    await delay(200);
    
    try {
      const settings = await this.getAll();
      
      if (settings.length > 0) {
        const dbSettings = settings[0];
        return {
          workDuration: dbSettings.work_duration || this.defaultSettings.work_duration,
          shortBreakDuration: dbSettings.short_break_duration || this.defaultSettings.short_break_duration,
          longBreakDuration: dbSettings.long_break_duration || this.defaultSettings.long_break_duration,
          autoStartBreaks: dbSettings.auto_start_breaks || this.defaultSettings.auto_start_breaks,
          autoStartPomodoros: dbSettings.auto_start_pomodoros || this.defaultSettings.auto_start_pomodoros,
          soundEnabled: dbSettings.sound_enabled !== undefined ? dbSettings.sound_enabled : this.defaultSettings.sound_enabled,
          soundType: dbSettings.sound_type || this.defaultSettings.sound_type,
          soundVolume: dbSettings.sound_volume || this.defaultSettings.sound_volume
        };
      }
      
      // Create default settings if none exist
      return await this.createDefaultSettings();
    } catch (error) {
      console.error('Error getting settings:', error);
      return this.transformFromDb(this.defaultSettings);
    }
  }

  async createDefaultSettings() {
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        records: [{
          Name: 'User Settings',
          work_duration: this.defaultSettings.work_duration,
          short_break_duration: this.defaultSettings.short_break_duration,
          long_break_duration: this.defaultSettings.long_break_duration,
          auto_start_breaks: this.defaultSettings.auto_start_breaks,
          auto_start_pomodoros: this.defaultSettings.auto_start_pomodoros,
          sound_enabled: this.defaultSettings.sound_enabled,
          sound_type: this.defaultSettings.sound_type,
          sound_volume: this.defaultSettings.sound_volume
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return this.transformFromDb(this.defaultSettings);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return this.transformFromDb(result.data);
        }
      }
      
      return this.transformFromDb(this.defaultSettings);
    } catch (error) {
      console.error('Error creating default settings:', error);
      return this.transformFromDb(this.defaultSettings);
    }
  }

  async update(settings) {
    await delay(300);
    
    try {
      const existingSettings = await this.getAll();
      
      const dbData = {
        work_duration: settings.workDuration,
        short_break_duration: settings.shortBreakDuration,
        long_break_duration: settings.longBreakDuration,
        auto_start_breaks: settings.autoStartBreaks,
        auto_start_pomodoros: settings.autoStartPomodoros,
        sound_enabled: settings.soundEnabled,
        sound_type: settings.soundType,
        sound_volume: settings.soundVolume
      };

      if (existingSettings.length > 0) {
        // Update existing settings
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Id: existingSettings[0].Id,
            ...dbData
          }]
        };
        
        const response = await apperClient.updateRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return this.transformFromDb(result.data);
          } else {
            if (result.message) {
              throw new Error(result.message);
            }
          }
        }
      } else {
        // Create new settings
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Name: 'User Settings',
            ...dbData
          }]
        };
        
        const response = await apperClient.createRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (result.success) {
            return this.transformFromDb(result.data);
          }
        }
      }
      
      return settings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  transformFromDb(dbSettings) {
    return {
      workDuration: dbSettings.work_duration || this.defaultSettings.work_duration,
      shortBreakDuration: dbSettings.short_break_duration || this.defaultSettings.short_break_duration,
      longBreakDuration: dbSettings.long_break_duration || this.defaultSettings.long_break_duration,
      autoStartBreaks: dbSettings.auto_start_breaks || this.defaultSettings.auto_start_breaks,
      autoStartPomodoros: dbSettings.auto_start_pomodoros || this.defaultSettings.auto_start_pomodoros,
      soundEnabled: dbSettings.sound_enabled !== undefined ? dbSettings.sound_enabled : this.defaultSettings.sound_enabled,
      soundType: dbSettings.sound_type || this.defaultSettings.sound_type,
      soundVolume: dbSettings.sound_volume || this.defaultSettings.sound_volume
    };
  }

  async reset() {
    await delay(200);
    
    try {
      const existingSettings = await this.getAll();
      
      if (existingSettings.length > 0) {
        const apperClient = this.getApperClient();
        
        const params = {
          records: [{
            Id: existingSettings[0].Id,
            work_duration: this.defaultSettings.work_duration,
            short_break_duration: this.defaultSettings.short_break_duration,
            long_break_duration: this.defaultSettings.long_break_duration,
            auto_start_breaks: this.defaultSettings.auto_start_breaks,
            auto_start_pomodoros: this.defaultSettings.auto_start_pomodoros,
            sound_enabled: this.defaultSettings.sound_enabled,
            sound_type: this.defaultSettings.sound_type,
            sound_volume: this.defaultSettings.sound_volume
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
      
      return this.transformFromDb(this.defaultSettings);
    } catch (error) {
      console.error('Error resetting settings:', error);
      return this.transformFromDb(this.defaultSettings);
    }
  }
}

export default new SettingsService();