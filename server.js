require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

// DB
const db = require('./config/db');

// DB connection test
db.getConnection()
  .then(conn => {
    console.log('MySQL Connected');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL Connection Failed:', err.message);
  });

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/free-trial', require('./routes/freeTrial'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/students', require('./routes/students'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/question-types', require('./routes/questionTypes'));
app.use('/api/attempts', require('./routes/attempts'));

// HEALTH CHECK
app.get('/', (req, res) => {
  res.send('Ada21Tech API is running...');
});

// INIT DATABASE (RUN ONCE)
app.get('/init-db', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin','student') DEFAULT 'student',
        grade VARCHAR(20),
        status ENUM('active','pending','rejected') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.send('Database initialized');
  } catch (err) {
    console.error(err);
    res.status(500).send('DB init failed');
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// START SERVER
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});