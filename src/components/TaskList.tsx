import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useTaskContext } from '../contexts/TaskContext';
import { Priority } from '../types/taskTypes';

const TaskList: React.FC = () => {
  const { 
    tasks, 
    deleteTask, 
    toggleTaskCompletion, 
    filterTasks, 
    sortedTasks 
  } = useTaskContext();

  const [filter, setFilter] = useState<{
    completed?: boolean;
    priority?: Priority;
    tags?: string[];
  }>({});

  const filteredTasks = filterTasks(filter);

  const handleDragEnd = (result: DropResult) => {
    // ドラッグ&ドロップの実装は今後追加
    if (!result.destination) return;
  };

  return (
    <div className="task-list-container">
      <div className="filter-controls">
        <button onClick={() => setFilter({})}>全てのタスク</button>
        <button onClick={() => setFilter({ completed: false })}>未完了タスク</button>
        <button onClick={() => setFilter({ priority: Priority.HIGH })}>高優先度タスク</button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className="task-list"
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task ${task.completed ? 'completed' : ''} ${task.priority.toLowerCase()}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                      <div className="task-details">
                        <h3>{task.name}</h3>
                        <p>{task.description}</p>
                        <div className="task-meta">
                          <span>優先度: {task.priority}</span>
                          {task.dueDate && (
                            <span>期限: {task.dueDate.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteTask(task.id)}>削除</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;