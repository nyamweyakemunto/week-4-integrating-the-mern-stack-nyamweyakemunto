import { useState } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { PlusIcon } from '@heroicons/react/24/outline';

const TaskList = ({ tasks, loading, setTasks }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          setTasks={setTasks}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          setShowForm={setShowForm}
        />
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks found. Create your first task!
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              setTasks={setTasks}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;