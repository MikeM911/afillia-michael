require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the project root so /create and /login are accessible
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.redirect('/create/index.html');
});

// Endpoint to check if email exists
app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, firstName, lastName, country, city, phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, country, city, phone, verified, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [email, password, firstName, lastName, country, city, phone, false, code]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});