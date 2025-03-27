import React, { createContext, useState, useContext, useEffect } from 'react';
import { Task, Priority, createTask, sortTasks } from '../types/taskTypes';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  filterTasks: (filters: {
    completed?: boolean;
    priority?: Priority;
    tags?: string[];
  }) => Task[];
  sortedTasks: (sortBy?: 'priority' | 'dueDate' | 'createdAt') => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // LocalStorageからタスクをロード
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks 
      ? JSON.parse(savedTasks).map((task: Task) => ({
          ...task, 
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }))
      : [];
  });

  // タスクが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filterTasks = (filters: {
    completed?: boolean;
    priority?: Priority;
    tags?: string[];
  }) => {
    return tasks.filter(task => {
      if (filters.completed !== undefined && task.completed !== filters.completed) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.tags?.length && !filters.tags.some(tag => task.tags?.includes(tag))) return false;
      return true;
    });
  };

  const sortedTasks = (sortBy?: 'priority' | 'dueDate' | 'createdAt') => {
    return sortTasks(tasks, sortBy);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      filterTasks,
      sortedTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

// カスタムフックを使用してコンテキストにアクセス
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};