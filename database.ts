import * as SQLite from 'expo-sqlite';

export interface Task {
  id?: number;
  title: string;
  score: number;
  completed: boolean;
  createdAt: string;
}

export interface TaskWithId extends Task {
  id: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('dopamax.db');
      
      // Create tasks table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          score INTEGER NOT NULL,
          completed BOOLEAN NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL
        );
      `);
      
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async addTask(task: Omit<Task, 'id'>): Promise<TaskWithId> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.runAsync(
      'INSERT INTO tasks (title, score, completed, createdAt) VALUES (?, ?, ?, ?)',
      [task.title, task.score, task.completed ? 1 : 0, task.createdAt]
    );
    
    return {
      id: result.lastInsertRowId,
      title: task.title,
      score: task.score,
      completed: task.completed,
      createdAt: task.createdAt,
    };
  }

  async getTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getAllAsync<Task>(
        'SELECT * FROM tasks ORDER BY createdAt DESC'
      );
      
      return result.map(task => ({
        ...task,
        completed: Boolean(task.completed)
      }));
    } catch (error) {
      console.error('Error getting tasks from database:', error);
      return [];
    }
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const setClause = Object.keys(updates)
        .filter(key => key !== 'id')
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = Object.entries(updates)
        .filter(([key]) => key !== 'id')
        .map(([_, value]) => value);
      
      await this.db.runAsync(
        `UPDATE tasks SET ${setClause} WHERE id = ?`,
        [...values, id]
      );
    } catch (error) {
      console.error('Error updating task in database:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting task from database:', error);
      throw error;
    }
  }

  async getCompletedTasksCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync<{count: number}>(
      'SELECT COUNT(*) as count FROM tasks WHERE completed = 1'
    );
    
    return result?.count || 0;
  }

  async getTotalDopamine(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    const result = await this.db.getFirstAsync<{total: number}>(
      'SELECT SUM(score) as total FROM tasks WHERE completed = 1'
    );
    
    return result?.total || 0;
  }
}

export const databaseService = new DatabaseService(); 