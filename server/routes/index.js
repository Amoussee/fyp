import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './userRoutes.js';
import schoolRoutes from './schoolRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import surveyRoutes from './surveyRoutes.js';

const apiRouter = express.Router();

apiRouter.use(cors()); // Allows your Next.js frontend to talk to this server
apiRouter.use(express.json()); // Allows the server to read req.body from your form

// Route Group: /api/users
apiRouter.use('/users', userRoutes);

// Route Group: /api/schools
apiRouter.use('/schools', schoolRoutes);

// Route Group: /api/surveys
apiRouter.use('/surveys', surveyRoutes);

// Route Group: /api/responses
apiRouter.use('/responses', responsesRoutes);

// Route Group: /api/template
apiRouter.use('/templates', surveyTemplateRoutes);

// Future groups (e.g., /api/products, /api/auth)
// apiRouter.use('/products', productRoutes);
// Route Group: /api/dashboards
apiRouter.use('/dashboards', dashboardRoutes);

// Route Group: /api/surveys
apiRouter.use('/surveys', surveyRoutes);

export default apiRouter;
