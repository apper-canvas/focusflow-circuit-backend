const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SessionService {
  constructor() {
    this.storageKey = 'focusflow_sessions';
  }
  
  async getAll() {
    await delay(250);
    
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored sessions:', error);
      }
    }
    
    return [];
  }
  
  async getById(id) {
    await delay(200);
    
    const sessions = await this.getAll();
    return sessions.find(session => session.id === id) || null;
  }
  
  async create(sessionData) {
    await delay(300);
    
    const sessions = await this.getAll();
    const newSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      endTime: null,
      duration: 25,
      type: 'work',
      completed: false,
      taskLabel: null,
      ...sessionData
    };
    
    sessions.push(newSession);
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    
    return { ...newSession };
  }
  
  async update(id, sessionData) {
    await delay(300);
    
    const sessions = await this.getAll();
    const index = sessions.findIndex(session => session.id === id);
    
    if (index === -1) {
      throw new Error('Session not found');
    }
    
    sessions[index] = { ...sessions[index], ...sessionData };
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    
    return { ...sessions[index] };
  }
  
  async delete(id) {
    await delay(200);
    
    const sessions = await this.getAll();
    const filtered = sessions.filter(session => session.id !== id);
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }
  
  async getTodaySessions() {
    await delay(200);
    
    const sessions = await this.getAll();
    const today = new Date().toDateString();
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime).toDateString();
      return sessionDate === today && session.completed;
    });
  }
}

export default new SessionService();