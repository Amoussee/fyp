import express from 'express';
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
