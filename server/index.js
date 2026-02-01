import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import apiRouter from './routes/index.js';
import { authenticateUser } from './middleware/auth.middleware.js'; 

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`DEBUG: ${req.method} request to ${req.url}`);
  next();
});

// Use the grouped routes
// This makes every route in that file start with /api
app.use('/api', authenticateUser, apiRouter);

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


