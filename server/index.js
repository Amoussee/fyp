import express from 'express';
import db from './db.js';
import cors from 'cors';
import 'dotenv/config'; // Modern way to load environment variables in ES modules

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); 

// Basic Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/users', async (req, res) => {
  try {
    // With mysql2/promise, you destructure the result: [rows, fields]
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
