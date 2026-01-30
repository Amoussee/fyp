import express from 'express';
import SurveyTemplateController from '../controllers/surveyTemplate.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js'; 

const router = express.Router();

router.route('/')
  .get(authenticateUser,SurveyTemplateController.getAll)
  .post(authenticateUser,SurveyTemplateController.create);

router.route('/:id')
  .get(authenticateUser,SurveyTemplateController.getById)
  .put(authenticateUser,SurveyTemplateController.update)
  .delete(authenticateUser,SurveyTemplateController.delete);

export default router;
