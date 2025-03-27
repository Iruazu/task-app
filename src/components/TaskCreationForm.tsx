import React, { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { createTask, Priority } from '../types/taskTypes';

const TaskCreationForm: React.FC = () => {
  const { addTask } = useTaskContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = createTask(
      name, 
      description, 
      priority, 
      dueDate, 
      tags
    );
    
    addTask(newTask);
    
    // フォームをリセット
    setName('');
    setDescription('');
    setPriority(Priority.MEDIUM);
    setDueDate(undefined);
    setTags([]);
    setNewTag('');
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-creation-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="タスク名"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="タスクの説明"
      />
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        {Object.values(Priority).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        type="date"
        onChange={(e) => setDueDate(new Date(e.target.value))}
      />
      <div className="tag-section">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="タグを追加"
        />
        <button type="button" onClick={addTag}>タグ追加</button>
        <div className="tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <button type="submit">タスク作成</button>
    </form>
  );
};

export default TaskCreationForm;