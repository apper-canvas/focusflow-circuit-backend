const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SessionService {
  constructor() {
    this.tableName = 'session';
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    await delay(250);
    
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: ['Name', 'start_time', 'end_time', 'duration', 'type', 'completed', 'task_label'],
        orderBy: [{
          fieldName: 'start_time',
          SortType: 'DESC'
        }],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(session => this.transformFromDb(session));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  async getById(id) {
    await delay(200);
    
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        fields: ['Name', 'start_time', 'end_time', 'duration', 'type', 'completed', 'task_label']
      };
      
      const response = await apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      return this.transformFromDb(response.data);
    } catch (error) {
      console.error(`Error fetching session with ID ${id}:`, error);
      return null;
    }
  }

  async create(sessionData) {
    await delay(300);
    
    try {
      const apperClient = this.getApperClient();
      
      // Transform to database format and include only updateable fields
      const dbData = {
        Name: sessionData.taskLabel || `${sessionData.type} session`,
        start_time: sessionData.startTime ? new Date(sessionData.startTime).toISOString().slice(0, 19) : new Date().toISOString().slice(0, 19),
        end_time: sessionData.endTime ? new Date(sessionData.endTime).toISOString().slice(0, 19) : null,
        duration: sessionData.duration || 25,
        type: sessionData.type || 'work',
        completed: sessionData.completed || false,
        task_label: sessionData.taskLabel || null
      };
      
      const params = {
        records: [dbData]
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
        } else {
          if (result.message) {
            throw new Error(result.message);
          }
          if (result.errors && result.errors.length > 0) {
            throw new Error(result.errors[0].message);
          }
        }
      }
      
      throw new Error('Failed to create session');
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async update(id, sessionData) {
    await delay(300);
    
    try {
      const apperClient = this.getApperClient();
      
      // Transform to database format and include only updateable fields
      const dbData = {
        Id: parseInt(id),
        start_time: sessionData.startTime ? new Date(sessionData.startTime).toISOString().slice(0, 19) : undefined,
        end_time: sessionData.endTime ? new Date(sessionData.endTime).toISOString().slice(0, 19) : undefined,
        duration: sessionData.duration,
        type: sessionData.type,
        completed: sessionData.completed,
        task_label: sessionData.taskLabel
      };
      
      // Remove undefined fields
      Object.keys(dbData).forEach(key => {
        if (dbData[key] === undefined) {
          delete dbData[key];
        }
      });
      
      const params = {
        records: [dbData]
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
      
      throw new Error('Failed to update session');
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async delete(id) {
    await delay(200);
    
    try {
      const apperClient = this.getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return result.success;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  async getTodaySessions() {
    await delay(200);
    
    try {
      const apperClient = this.getApperClient();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const params = {
        fields: ['Name', 'start_time', 'end_time', 'duration', 'type', 'completed', 'task_label'],
        where: [
          {
            fieldName: 'start_time',
            operator: 'GreaterThanOrEqualTo',
            values: [today.toISOString().slice(0, 10)]
          },
          {
            fieldName: 'start_time',
            operator: 'LessThan',
            values: [tomorrow.toISOString().slice(0, 10)]
          },
          {
            fieldName: 'completed',
            operator: 'ExactMatch',
            values: [true]
          }
        ],
        orderBy: [{
          fieldName: 'start_time',
          SortType: 'DESC'
        }],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(session => this.transformFromDb(session));
    } catch (error) {
      console.error('Error fetching today sessions:', error);
      return [];
    }
  }

  transformFromDb(dbSession) {
    return {
      id: dbSession.Id?.toString() || Date.now().toString(),
      startTime: dbSession.start_time ? new Date(dbSession.start_time) : new Date(),
      endTime: dbSession.end_time ? new Date(dbSession.end_time) : null,
      duration: dbSession.duration || 25,
      type: dbSession.type || 'work',
      completed: dbSession.completed || false,
      taskLabel: dbSession.task_label || null
    };
  }
}

export default new SessionService();