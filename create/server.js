require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

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

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});