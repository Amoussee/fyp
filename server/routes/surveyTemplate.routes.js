import express from 'express';
import SurveyTemplateController from '../controllers/surveyTemplate.controller.js';

const router = express.Router();

router.route('/')
  .get(SurveyTemplateController.getAll)
  .post(SurveyTemplateController.create);

router.route('/:id')
  .get(SurveyTemplateController.getById)
  .put(SurveyTemplateController.update)
  .delete(SurveyTemplateController.delete);

export default router;
