import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Edit2Icon, Edit3Icon, EditIcon } from 'lucide-react';

// Simplified versions of shadcn/ui components
const Input = ({ className, ...props }) => <input className={`px-3 py-2 rounded-md ${className}`} {...props} />;
const Button = ({ className, children, ...props }) => <button className={`px-3 py-2 rounded-md ${className}`} {...props}>{children}</button>;

const TaskTracker = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete React project", completed: true },
    { id: 2, text: "Go grocery shopping", completed: true },
    { id: 3, text: "Call mom", completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask();
    }
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Task Tracker</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
              className="flex-grow mr-2 bg-gray-700 text-white border-2 border-blue-500 focus:outline-none focus:border-blue-600"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition duration-300">
              <Plus size={20} className="mr-2" />
              Add Task
            </Button>
          </div>
        </form>

        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${task.completed ? 'opacity-70' : ''}`}>
              <div className="p-4 flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="mr-4 h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                {editingTask && editingTask.id === task.id ? (
                  <div className="flex-grow flex items-center">
                    <Input
                      type="text"
                      value={editingTask.text}
                      onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                      className="flex-grow mr-2 bg-gray-700 text-white border-2 border-yellow-500 focus:outline-none focus:border-yellow-600"
                    />
                    <Button onClick={saveEdit} className="mr-2 bg-green-600 hover:bg-green-700 transition duration-300">
                      <Check size={20} />
                    </Button>
                    <Button onClick={cancelEdit} className="bg-red-600 hover:bg-red-700 transition duration-300">
                      <X size={20} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center">
                    <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.text}
                    </span>
                    <Button onClick={() => startEditing(task)} className="mr-2 bg-yellow-600 hover:bg-yellow-700 transition duration-300">
                      <EditIcon size={20} />
                    </Button>
                    <Button onClick={() => deleteTask(task.id)} className="bg-red-600 hover:bg-red-700 transition duration-300">
                      <Trash2 size={20} />
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskTracker;