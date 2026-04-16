const db = require('../config/db'); // FIXED PATH
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role || 'student']);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};