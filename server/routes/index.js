import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRoutes from './user.routes.js';
import schoolRoutes from './school.routes.js';
import surveyRoutes from './survey.routes.js';
import responsesRoutes from './responses.routes.js';
import surveyRoutes from './surveyTemplate.routes.js';

const apiRouter = express.Router();
const PORT = process.env.PORT || 5001;

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

export default apiRouter;
