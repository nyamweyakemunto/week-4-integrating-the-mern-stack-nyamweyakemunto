import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTask, setEditTask] = useState('');

  const handleAddTask = () => {
    setTasks([...tasks, newTask]);
    setNewTask('');
  };

  const handleEditTask = () => {
    const updatedTasks = tasks.map((task, index) => 
      index === editIndex ? editTask : task
    );
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditTask('');
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1 className="text-red text-underline">This is a test</h1>
      <div>
        <input 
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              {task}
              <button onClick={() => { setEditIndex(index); setEditTask(task); }}>Edit</button>
              <button onClick={() => handleDeleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editIndex !== null && (
        <div>
          <h2>Edit Task</h2>
          <input 
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            placeholder="Edit task"
          />
          <button onClick={handleEditTask}>Update Task</button>
        </div>
      )}
    </div>
  );
}

export default App;
