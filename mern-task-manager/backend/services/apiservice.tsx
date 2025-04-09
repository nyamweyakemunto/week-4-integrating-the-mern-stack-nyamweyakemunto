import axios from 'axios';
import { Task } from '';

// Define the base URL for the API
const API_BASE_URL = 'http://localhost:5000/api';

// Interface for task data sent to API
interface TaskData {
  title: string;
  description: string;
  priority: string;
  dueDate?: Date;
  status?: string;
}

// Interface for the response from the API
interface ApiTask {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate?: string;
  createdAt: string;
}

// Helper function to convert API task to frontend task
const mapApiTaskToTask = (apiTask: ApiTask): Task => ({
  id: apiTask._id,
  title: apiTask.title,
  description: apiTask.description,
  completed: apiTask.status === 'completed',
  priority: apiTask.priority as 'low' | 'medium' | 'high',
  dueDate: apiTask.dueDate ? new Date(apiTask.dueDate) : undefined,
  createdAt: new Date(apiTask.createdAt)
});

// API service functions
export const apiService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      return response.data.map(mapApiTaskToTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
      return mapApiTaskToTask(response.data);
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData: TaskData): Promise<Task> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return mapApiTaskToTask(response.data);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id: string, taskData: Partial<TaskData>): Promise<Task> => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
      return mapApiTaskToTask(response.data);
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },

  // Toggle task status between completed and pending
  toggleTaskStatus: async (id: string): Promise<Task> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/tasks/${id}/toggle-status`);
      return mapApiTaskToTask(response.data);
    } catch (error) {
      console.error(`Error toggling status for task with ID ${id}:`, error);
      throw error;
    }
  }
};
