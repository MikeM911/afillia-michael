require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool(); // Uses .env variables

module.exports = pool;