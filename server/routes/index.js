import express from 'express';
import userRoutes from './userRoutes.js'; 

const apiRouter = express.Router();

// Route Group: /api/users
// This matches your goal of having users/...
apiRouter.use('/users', userRoutes);

// Future groups (e.g., /api/products, /api/auth)
// apiRouter.use('/products', productRoutes);

export default apiRouter;