import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Task, Priority } from '@/types/task';
import { apiService } from '@/services/apiService';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string, priority: Priority, dueDate?: Date) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleCompleted: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error("Error loading tasks from API:", err);
      setError("Failed to load tasks. Please try again later.");
      loadTasksFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadTasksFromLocalStorage = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(tasksWithDates);
      } catch (localErr) {
        console.error("Error loading tasks from localStorage:", localErr);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  const handleError = (message: string, error: unknown) => {
    console.error(message, error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const addTask = async (title: string, description: string, priority: Priority, dueDate?: Date) => {
    setLoading(true);
    try {
      const newTask = await apiService.createTask({
        title,
        description,
        priority,
        dueDate,
        status: 'pending',
      });
      
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      handleSuccess("Your new task has been added successfully.");
    } catch (err) {
      handleError("Failed to create task. Please try again.", err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      const apiUpdates: any = { ...updates };
      
      if ('completed' in updates) {
        apiUpdates.status = updates.completed ? 'completed' : 'pending';
        delete apiUpdates.completed;
      }

      const updatedTask = await apiService.updateTask(id, apiUpdates);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      
      handleSuccess("Your task has been updated successfully.");
    } catch (err) {
      handleError("Failed to update task. Please try again.", err);
      setError(`Failed to update task with ID ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    try {
      await apiService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
        variant: "destructive",
      });
    } catch (err) {
      handleError("Failed to delete task. Please try again.", err);
      setError(`Failed to delete task with ID ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (id: string) => {
    setLoading(true);
    try {
      const updatedTask = await apiService.toggleTaskStatus(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      handleError("Failed to update task status. Please try again.", err);
      setError(`Failed to toggle status for task with ID ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleCompleted,
    loading,
    error,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};