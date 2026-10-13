require('dotenv').config();
const express = require('express');
const path = require('path');

const studentRoutes = require('./routes/students');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Global Custom Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Admin API Key Auth Middleware
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(403).json({ error: "403 Forbidden: Missing x-api-key header" });
  }
  next();
};

// Part A & B: Basic Routes
app.get('/about', (req, res) => {
  res.json({ name: "Ashish Singh Rawat", rollNumber: "2024001" });
});

app.get('/courses', (req, res) => {
  res.json(["Full Stack Web Development", "Data Structures", "Database Management"]);
});

app.post('/echo', (req, res) => {
  res.json(req.body);
});

// Part C: Route Parameters & Query Strings
app.get('/search', (req, res) => {
  const { name, age } = req.query;
  res.json({ name, age });
});

app.get('/products/:category/:id', (req, res) => {
  const { category, id } = req.params;
  res.json({ category, id });
});

// Part D: Protected Route
app.get('/admin/dashboard', checkApiKey, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

// Part E: Forms & JSON Submissions
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({ message: `Registration successful for ${name}` });
});

app.post('/contact', (req, res) => {
  console.log("Contact Form Received:", req.body);
  res.send("Thank you for contacting us!");
});

// Part F & J: Router Mounting
app.use('/api/students', studentRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);

// Part H: 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Part H: Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Error Log:", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});