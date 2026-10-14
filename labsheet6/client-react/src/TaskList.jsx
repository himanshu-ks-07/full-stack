import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';
const API_KEY = import.meta.env.VITE_API_KEY || 'mysecretkey123';

function TaskList() {
  // Q4: 3-state pattern (loading, error, data)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Fetch tasks using axios
  // Axios automatically parses JSON and throws an error for non-2xx status codes
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Q4: POST a new task (with x-api-key header)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(
        API_URL,
        { title: newTaskTitle },
        { headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' } }
      );
      setTasks([...tasks, response.data]); // Instant UI update
      setNewTaskTitle('');
    } catch (err) {
      alert(`POST Error: ${err.response?.data?.error || err.message}`);
    }
  };

  // Q4 & Q5: DELETE task (with x-api-key header & error handling)
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { 'x-api-key': API_KEY }
      });
      setTasks(tasks.filter(task => task.id !== id)); // Instant UI removal
    } catch (err) {
      // Q5: Graceful error message on fake ID or failure
      const errorMsg = err.response?.data?.error?.message || err.response?.data?.error || err.message;
      alert(`Delete Failed: ${errorMsg}`);
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center' }}>Loading tasks...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>Error: {error}</h2>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Task Manager Mini App (React)</h1>

      {/* Form to Add Task */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter new task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ flex: '1', padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
            <span>
              <strong>#{task.id}</strong> {task.title} {task.completed ? '✅' : '⏳'}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Q5: Test Error Handling with Fake ID */}
      <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px dashed #ccc' }}>
        <button
          onClick={() => handleDeleteTask(9999)}
          style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Test Error Boundary (Delete Fake ID 9999)
        </button>
      </div>
    </div>
  );
}

export default TaskList;