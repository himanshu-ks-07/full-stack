require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || "mysecretkey123";

// Enable CORS for development
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Global Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Auth-check Middleware for Protected Routes
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "401 Unauthorized: Invalid or missing x-api-key header" });
  }
  next();
};

// In-memory Task Store (5 tasks)
let tasks = [
  { id: 1, title: "Complete Labsheet 5", completed: true },
  { id: 2, title: "Build Express REST API", completed: false },
  { id: 3, title: "Set up CORS and Auth Middleware", completed: false },
  { id: 4, title: "Create React Frontend Client", completed: false },
  { id: 5, title: "Test Full Stack Integration", completed: false }
];

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    const error = new Error("Task not found");
    error.status = 404;
    return next(error);
  }
  res.json(task);
});

// POST /api/tasks (Protected)
app.post('/api/tasks', checkApiKey, (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Task title is required" });
  }
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id (Protected)
app.put('/api/tasks/:id', checkApiKey, (req, res, next) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    const error = new Error("Task not found for update");
    error.status = 404;
    return next(error);
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body, id };
  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id (Protected)
app.delete('/api/tasks/:id', checkApiKey, (req, res, next) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    const error = new Error("Task not found for deletion");
    error.status = 404;
    return next(error);
  }
  const deletedTask = tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully", task: deletedTask[0] });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Central Error Log:", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode
    }
  });
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});