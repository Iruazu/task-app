import { v4 as uuidv4 } from 'uuid';

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  dueDate?: Date;
  completed: boolean;
  tags?: string[];
  createdAt: Date;
}

export const createTask = (
  name: string, 
  description: string, 
  priority: Priority = Priority.MEDIUM, 
  dueDate?: Date, 
  tags?: string[]
): Task => ({
  id: uuidv4(),
  name,
  description,
  priority,
  dueDate,
  completed: false,
  tags: tags || [],
  createdAt: new Date()
});

// タスクの状態を管理するためのユーティリティ関数
export const sortTasks = (tasks: Task[], sortBy: 'priority' | 'dueDate' | 'createdAt' = 'createdAt') => {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });
};