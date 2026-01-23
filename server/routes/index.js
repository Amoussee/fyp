import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './userRoutes.js';
import schoolRoutes from './schoolRoutes.js';
import surveyRoutes from './surveyRoutes.js';

const apiRouter = express.Router();
const PORT = process.env.PORT || 5001;

apiRouter.use(cors()); // Allows your Next.js frontend to talk to this server
apiRouter.use(express.json()); // Allows the server to read req.body from your form

// Route Group: /api/users
// This matches your goal of having users/...
apiRouter.use('/users', userRoutes);

// Route Group: /api/schools
apiRouter.use('/schools', schoolRoutes);

// Route Group: /api/surveys
apiRouter.use('/surveys', surveyRoutes);

// Future groups (e.g., /api/products, /api/auth)
// apiRouter.use('/products', productRoutes);

export default apiRouter;
