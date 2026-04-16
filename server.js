require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Points to your database config

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (for student profile pictures or exam images)
app.use('/uploads', express.static('uploads'));

// Verify Database Connection on startup
db.getConnection()
  .then(conn => {
    console.log('✅ Railway MySQL Connected Successfully');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.message);
  });

// =====================
// API ROUTES
// =====================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/free-trial', require('./routes/freeTrial'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/students', require('./routes/students'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/question-types', require('./routes/questionTypes'));
app.use('/api/attempts', require('./routes/attempts'));

// Health Check for Render/Railway monitoring
app.get('/', (req, res) => {
  res.send('Ada21Tech API is Live and Functional');
});

// Database Initializer (Run once: your-url.app/init-db)
app.get('/init-db', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.send('✅ Users table created successfully');
  } catch (err) {
    res.status(500).send('❌ DB Init Error: ' + err.message);
  }
});

// Error Handling for missing routes
app.use((req, res) => res.status(404).json({ message: 'API Route not found' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});