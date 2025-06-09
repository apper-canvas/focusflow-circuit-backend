const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  constructor() {
    this.storageKey = 'focusflow_settings';
    this.defaultSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true,
      soundType: 'none',
      soundVolume: 50
    };
  }
  
  async getSettings() {
    await delay(200);
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return { ...this.defaultSettings, ...JSON.parse(stored) };
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
      }
    }
    
    return { ...this.defaultSettings };
  }
  
  async update(settings) {
    await delay(300);
    
    const updatedSettings = { ...this.defaultSettings, ...settings };
    localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
    
    return { ...updatedSettings };
  }
  
  async reset() {
    await delay(200);
    
    localStorage.removeItem(this.storageKey);
    return { ...this.defaultSettings };
  }
}

export default new SettingsService();