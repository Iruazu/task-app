import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import TaskList from './components/TaskList';
import TaskCreationForm from './components/TaskCreationForm';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <div className="app-container">
        <h1>タスク管理アプリ</h1>
        <TaskCreationForm />
        <TaskList />
      </div>
    </TaskProvider>
  );
};

export default App;