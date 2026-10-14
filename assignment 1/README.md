# COER UNIVERSITY, ROORKEE
## Department of Computer Science & Engineering
### Full Stack Web Development
### Unit I Assignment: Full Stack Architecture & Planning

---

### **Question 1**
> **Write a folder structure (as a tree) for a full stack e-commerce app using React (frontend), Express (backend), and MySQL (database). In 2 lines, justify why the `routes/` and `models/` folders should never import each other directly.**

#### **Answer:**

#### **1. Full Stack E-Commerce Folder Structure:**
```text
ecommerce-app/
├── client/                     # Frontend (React.js)
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── assets/             # Images, icons, static assets
│   │   ├── components/         # Reusable UI widgets (Navbar, Footer, ProductCard)
│   │   ├── pages/              # Route views (Home, Products, Cart, Checkout, Login)
│   │   ├── services/           # API integration calls (api.js, authService.js)
│   │   ├── context/            # Global state (CartContext.jsx, AuthContext.jsx)
│   │   ├── hooks/              # Custom React hooks (useCart.js)
│   │   ├── App.jsx             # Main routing component
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Global stylesheets
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── server/                     # Backend (Node.js & Express)
│   ├── config/                 # Configurations & DB connection pool
│   │   └── db.js               # MySQL connection pool setup
│   ├── controllers/            # Request handlers & core business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   ├── models/                 # Database access layer (SQL queries & schemas)
│   │   ├── userModel.js
│   │   ├── productModel.js
│   │   └── orderModel.js
│   ├── routes/                 # Endpoint route definitions & mapping
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middlewares/            # Custom middlewares (JWT auth, error handler)
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── utils/                  # Helper utilities (jwtToken.js, validator.js)
│   ├── .env                    # Backend environment variables (PORT, DB credentials)
│   ├── server.js               # Server entry point & Express app setup
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                # Root package.json (concurrently dev scripts)
```

#### **2. Why `routes/` and `models/` should NEVER import each other directly (Justification):**
`routes/` and `models/` must remain decoupled to enforce the **Separation of Concerns** principle and prevent circular dependency bugs. Instead, the `controllers/` layer acts as the coordinator: `routes/` merely match HTTP URLs to controller methods, and `controllers/` invoke `models/` to execute database queries.

---

### **Question 2**
> **This React component fetches data using a hardcoded localhost URL. Explain in 2 lines why this call will fail once deployed to production, and rewrite the fetch line using an environment variable.**
> ```javascript
> function ProductList() {
>   useEffect(() => {
>     fetch("http://localhost:5000/api/products")
>       .then(res => res.json())
>       .then(setProducts);
>   }, []);
>   ...
> }
> ```

#### **Answer:**

#### **1. Why it fails in production (2 lines):**
`localhost` refers to the client device running the browser rather than the deployed cloud server, causing the browser to send requests to the user's own machine where no backend is listening. Furthermore, production backends are hosted on public HTTPS domains rather than insecure local ports like `5000`.

#### **2. Rewritten Fetch Line:**

- **For Vite React Projects (`import.meta.env`):**
```javascript
function ProductList() {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(setProducts);
  }, []);
  // ...
}
```

- **For Create React App (`process.env`):**
```javascript
fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products`)
```

---

### **Question 3**
> **Write a `.env` file and the corresponding dotenv-loading code for a Node.js/Express backend that needs `PORT`, `DB_URL`, and `JWT_SECRET`. In 1 line, explain why `.env` should never be committed to Git.**

#### **Answer:**

#### **1. `.env` File:**
```env
PORT=5000
DB_URL=mysql://root:secure_db_pass@localhost:3306/ecommerce_db
JWT_SECRET=super_secret_jwt_access_token_key_2026_xyz
```

#### **2. Dotenv-loading Code (`server.js`):**
```javascript
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Example usage
console.log(`Server starting on port: ${PORT}`);
```

#### **3. Why `.env` should never be committed to Git (1 line):**
The `.env` file contains sensitive security credentials, private database passwords, and encryption keys which, if committed, become exposed to unauthorized users and lead to severe system breaches.

---

### **Question 4**
> **A React frontend calling an Express API gets a CORS error in the browser console on every request. Write the exact Express middleware/package code that fixes it, and explain in 1 line why the browser blocks the request in the first place.**

#### **Answer:**

#### **1. Express Middleware Code to Fix CORS:**
Install package:
```bash
npm install cors
```

In `server.js`:
```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all incoming requests (or restrict to React origin)
app.use(cors({
  origin: 'http://localhost:5173', // Your React App URL (or '*' for all origins)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

#### **2. Why the browser blocks the request (1 line):**
The browser enforces the **Same-Origin Policy (SOP)** security rule, which blocks cross-origin HTTP requests unless the server explicitly returns the `Access-Control-Allow-Origin` response header.

---

### **Question 5**
> **Design a REST API contract (as a table: Endpoint | Method | Request Body | Response) for a "Book Library" system with 4 endpoints covering create, read, update, and delete.**

#### **Answer:**

| Endpoint | Method | Request Body (JSON) | Response (Status Code & JSON) |
| :--- | :--- | :--- | :--- |
| **`/api/books`** | `POST` | `{"title": "Clean Code", "author": "Robert C. Martin", "isbn": "978-0132350884", "copies": 5}` | **`201 Created`**<br>`{"success": true, "message": "Book added successfully", "data": {"book_id": 101, "title": "Clean Code", "author": "Robert C. Martin", "copies": 5}}` |
| **`/api/books`** | `GET` | *None* | **`200 OK`**<br>`{"success": true, "count": 2, "data": [{"book_id": 101, "title": "Clean Code", "author": "Robert C. Martin", "copies": 5}]}` |
| **`/api/books/:id`** | `PUT` | `{"title": "Clean Code (Updated)", "copies": 8}` | **`200 OK`**<br>`{"success": true, "message": "Book updated successfully", "data": {"book_id": 101, "title": "Clean Code (Updated)", "copies": 8}}` |
| **`/api/books/:id`** | `DELETE`| *None* | **`200 OK`**<br>`{"success": true, "message": "Book with ID 101 deleted successfully"}` |

---

### **Question 6**
> **This Express code creates a new database connection inside every route handler. Rewrite it so the connection is created once and reused across routes, and explain in 2 lines why the original version is a performance problem.**
> ```javascript
> app.get('/products', (req, res) => {
>   const db = mysql.createConnection({ host: 'localhost', user: 'root' });
>   db.query('SELECT * FROM products', (err, rows) => res.json(rows));
> });
> ```

#### **Answer:**

#### **1. Rewritten Code (Connection Pool Reused Across Routes):**
```javascript
const express = require('express');
const mysql = require('mysql2'); // or 'mysql'
const app = express();

// Create connection pool ONCE outside the routes
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Reusable route handler
app.get('/products', (req, res) => {
  pool.query('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(rows);
  });
});
```

#### **2. Why the original is a performance problem (2 lines):**
Opening a new TCP database connection for every incoming HTTP request creates huge latency due to repeated authentication and socket handshakes. Under concurrent user traffic, this rapidly exhausts MySQL's maximum connection limit (`max_connections`), leading to connection timeouts and server crashes.

---

### **Question 7**
> **Write the "scripts" section of `package.json` for a full stack project where `npm run dev` should start both the backend (`nodemon server.js`) and the frontend (`npm start` inside a client folder) together, using the `concurrently` package.**

#### **Answer:**

Install package in root:
```bash
npm install concurrently --save-dev
```

In the root **`package.json`**:
```json
"scripts": {
  "server": "nodemon server.js",
  "client": "npm start --prefix client",
  "dev": "concurrently \"nodemon server.js\" \"npm start --prefix client\""
}
```

*(Note: For Vite-based React clients, replace `npm start --prefix client` with `npm run dev --prefix client`)*.

---

### **Question 8**
> **A teammate's code hardcodes an API key directly inside a React component. Rewrite the code using an environment variable instead, and explain the security risk in 2 lines.**
> ```javascript
> const response = await fetch(
>   `https://api.weather.com/data?key=sk_live_9f8a7b6c5d4e`
> );
> ```

#### **Answer:**

#### **1. Rewritten Code using Environment Variable:**
- **For Vite React (`.env` -> `VITE_WEATHER_API_KEY`):**
```javascript
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const response = await fetch(`https://api.weather.com/data?key=${API_KEY}`);
const data = await response.json();
```
- **For Create React App (`.env` -> `REACT_APP_WEATHER_API_KEY`):**
```javascript
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const response = await fetch(`https://api.weather.com/data?key=${API_KEY}`);
```

#### **2. Security Risk Explanation (2 lines):**
Because React code is bundled and compiled into static client-side JavaScript, any hardcoded secret is downloaded directly to the end user's browser where anyone can extract it via browser DevTools or Network tabs. Malicious users can then hijack your API key, exhaust your billing limits, or compromise backend resources.

---

### **Question 9**
> **Write pseudocode (as commented steps) tracing the full request-response cycle when a user submits a login form in a full stack app — from the button click to the database query to the UI update.**

#### **Answer:**

```javascript
// ============================================================================
// FULL STACK REQUEST-RESPONSE CYCLE: USER LOGIN
// ============================================================================

// [STEP 1: USER INTERACTION & CLIENT-SIDE EVENT]
// User types email/password in input fields and clicks the "Sign In" button.
// The <form onSubmit={handleLogin}> event handler is triggered.
function handleLogin(event) {
  event.preventDefault(); // Prevents default full-page reload

  // [STEP 2: CLIENT-SIDE VALIDATION & HTTP REQUEST DISPATCH]
  // Frontend validates non-empty inputs and serializes data into a JSON payload.
  const credentials = { email, password };
  
  // Sends asynchronous HTTP POST request to Express backend endpoint
  fetch("https://api.example.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  })
  .then(res => res.json())
  .then(data => {
    // [STEP 8: CLIENT RECEIVES RESPONSE & TOKEN STORAGE]
    if (data.token) {
      // Store JWT token in secure storage (localStorage or HttpOnly cookie)
      localStorage.setItem("authToken", data.token);

      // [STEP 9: UI STATE UPDATE & ROUTING]
      // Update global AuthContext state (e.g., setUser(data.user), setIsLoggedIn(true))
      // React triggers re-render, showing user dashboard and welcome toast.
      navigate("/dashboard");
    } else {
      // Display error message (e.g., "Invalid credentials")
      setError(data.message);
    }
  });
}

// ----------------------------------------------------------------------------
// SERVER-SIDE PROCESSING (Express.js & MySQL)
// ----------------------------------------------------------------------------

// [STEP 3: NETWORK & CORS CHECK]
// Browser sends preflight OPTIONS request if necessary; Express CORS middleware allows it.

// [STEP 4: BODY PARSING & ROUTING]
// Express app.use(express.json()) middleware parses raw incoming HTTP body into req.body.
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // [STEP 5: DATABASE QUERY EXECUTION]
  // Backend queries MySQL database to check if user exists.
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (users.length === 0) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  const user = users[0];

  // [STEP 6: PASSWORD VERIFICATION]
  // Backend hashes provided password and compares with stored bcrypt hash in DB.
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }

  // [STEP 7: JWT TOKEN GENERATION & HTTP RESPONSE SENT]
  // Backend creates signed JWT payload containing user ID and role.
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  // Sends HTTP 200 OK status code with JSON response back over network to client
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token: token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});
```

---

### **Question 10**
> **This Express server crashes on the very first POST request. Identify the missing line that causes `req.body` to be undefined, and provide the corrected code.**
> ```javascript
> const express = require('express');
> const app = express();
> 
> app.post('/login', (req, res) => {
>   const { username, password } = req.body;
>   res.send(`Welcome ${username}`);
> });
> 
> app.listen(3000);
> ```

#### **Answer:**

#### **1. Missing Line:**
The server is missing Express's built-in body-parsing middleware:
```javascript
app.use(express.json());
```
Without this middleware, Express does not parse incoming JSON payloads, leaving `req.body` as `undefined` and causing a runtime `TypeError: Cannot destructure property 'username' of 'req.body' as it is undefined`.

#### **2. Corrected Code:**
```javascript
const express = require('express');
const app = express();

// FIX: Middleware to parse incoming JSON request bodies into req.body
app.use(express.json());

// (Optional) For form-urlencoded submissions:
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).send("Username is required");
  }
  res.send(`Welcome ${username}`);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```
