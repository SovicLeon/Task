const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'flats',
  password: 'noel',
  port: 5432,
});

// Enable CORS middleware
app.use(cors());

app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM flats.property');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
